import { useEffect, useRef, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import axios from 'axios'
import { useAppDispatch, useAppSelector } from './redux/hooks'
import { setToken, clearToken, selectToken } from './redux/jwtSlice'
import LoginPage from './components/LoginPage'
import RegisterPage from './components/RegisterPage'
import { clearUser, selectUser, setUser } from './redux/userSlice'
import { Typography } from '@mui/material'
import AdminPanel from './components/AdminPanel/AdminPanel'
import UserPage from './components/UserPage'
import UnauthorizedPage from './components/UnauthorizedPage'
import PageTransition from './components/PageTransition'

interface AppRoutesProps {
  isAuthenticated: boolean
  checkAccess: (allowedRoles?: string[]) => boolean
  role?: string | null
}

const AppRoutes = ({ isAuthenticated, checkAccess, role }: AppRoutesProps) => {
  const location = useLocation()

  return (
    <PageTransition transitionKey={location.pathname}>
      <Routes location={location}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/"
          element={
            !isAuthenticated ? <Navigate to="/login" replace /> :
            role === 'admin' ? <Navigate to="/admin" replace /> :
            role === 'user' ? <Navigate to="/user" replace /> :
            <Navigate to="/login" replace />
          }
        />

        <Route
          path="/admin"
          element={
            checkAccess(['admin'])
              ? <AdminPanel />
              : <Navigate to={isAuthenticated ? "/unauthorized" : "/login"} replace />
          }
        />

        <Route
          path="/user"
          element={
            checkAccess(['user'])
            ? <UserPage />
            : <Navigate to={isAuthenticated ? "/unauthorized" : "/login"} replace />
          }
        />

        <Route
          path="/unauthorized"
          element={<UnauthorizedPage />}
        />
      </Routes>
    </PageTransition>
  )
}

function App() {
  const dispatch = useAppDispatch()
  const token = useAppSelector(selectToken)
  const user = useAppSelector(selectUser)
  const [isLoading, setIsLoading] = useState(true)
  const hasCheckedAuth = useRef(false)

  useEffect(() => {
    if (hasCheckedAuth.current) return
    hasCheckedAuth.current = true

    const checkAuth = async () => {
      const storedToken = localStorage.getItem('jwtToken')
      if (!storedToken) {
        dispatch(clearToken())
        setIsLoading(false)
        return
      }

      try {
        const response = await axios.get('http://localhost:8080/auth/me', {
          headers: {
            'Authorization': `Bearer ${storedToken}`,
          },
        })

        if (response.status === 200) {
          dispatch(setToken(storedToken))
          dispatch(setUser(response.data))
        } else {
          localStorage.removeItem('jwtToken')
          dispatch(clearToken())
          dispatch(clearUser())
        }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        if (error.response?.status === 401) {
          localStorage.removeItem('jwtToken')
          dispatch(clearToken())
          dispatch(clearUser())
        } else {
          console.error('Ошибка проверки токена:', error)
          dispatch(clearToken())
          dispatch(clearUser())
        }
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [dispatch])

  if (isLoading) {
    return (
      <>
        <Typography component={"h1"} variant='h4' sx={{
          display: 'flex',
          width: '100%',
          height: '100vh',
          textAlign:'center',
          justifyContent:'center',
          alignItems:'center'
        }} >Загрузка...</Typography>
      </>
    )
  }

  const isAuthenticated = !!token
  const role = user?.role

  console.log(role)

  const checkAccess = (allowedRoles?: string[]) => {
    if (!isAuthenticated) return false
    if (!allowedRoles) return true
    return allowedRoles.includes(role || '')
  }

  return (
    <Router>
      <AppRoutes
        isAuthenticated={isAuthenticated}
        checkAccess={checkAccess}
        role={role}
      />
    </Router>
  )
}

export default App
