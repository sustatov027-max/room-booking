import { useEffect, useRef, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import axios from 'axios'
import { useAppDispatch, useAppSelector } from './redux/hooks'
import { setToken, clearToken, selectToken } from './redux/jwtSlice'
import HomePage from './components/HomePage'
import LoginPage from './components/LoginPage'
import RegisterPage from './components/RegisterPage'

function App() {
  const dispatch = useAppDispatch()
  const token = useAppSelector(selectToken)
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
        } else {
          localStorage.removeItem('jwtToken')
          dispatch(clearToken())
        }
      } catch (error: any) {
        if (error.response?.status === 401) {
          localStorage.removeItem('jwtToken')
          dispatch(clearToken())
        } else {
          console.error('Ошибка проверки токена:', error)
          dispatch(clearToken())
        }
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [dispatch])

  if (isLoading) {
    return <div>Загрузка...</div>
  }

  const isAuthenticated = !!token

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={isAuthenticated ? <HomePage /> : <Navigate to="/login" replace />}
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </Router>
  )
}

export default App
