import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch } from '../redux/hooks'
import { setToken } from '../redux/jwtSlice'
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  CircularProgress,
  Stack,
  Link,
} from '@mui/material'

const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (loading) return

    setError('')
    setLoading(true)

    try {
      const response = await fetch('http://localhost:8080/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        const token = data.token
        localStorage.setItem('jwtToken', token)
        dispatch(setToken(token))
        navigate('/')
      } else {
        setError(data.message || 'Ошибка входа. Проверьте данные.')
      }
    } catch (error) {
      console.error('Ошибка:', error)
      setError('Ошибка входа. Проверьте соединение с сервером.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    document.title = 'Вход'
  }, [])

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            borderRadius: 2,
          }}
        >
          <Box
            sx={{
              backgroundColor: '#1976d2',
              borderRadius: '50%',
              padding: 1.5,
              marginBottom: 2,
            }}
          >
          </Box>

          <Typography component="h1" variant="h4" sx={{ marginBottom: 3, fontWeight: 600 }}>
            Вход в систему
          </Typography>

          <Typography variant="body2" color="textSecondary" sx={{ marginBottom: 3, textAlign: 'center' }}>
            Система бронирования комнат
          </Typography>

          {error && (
            <Alert severity="error" sx={{ width: '100%', marginBottom: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleLogin} sx={{ width: '100%' }}>
            <Stack spacing={2}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                placeholder="example@mail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
                variant="outlined"
                autoFocus
              />

              <TextField
                fullWidth
                label="Пароль"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
                variant="outlined"
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                sx={{
                  marginTop: 2,
                  textTransform: 'none',
                  fontSize: 16,
                  fontWeight: 600,
                }}
              >
                {loading ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CircularProgress size={20} color="inherit" />
                    Вход...
                  </Box>
                ) : (
                  'Войти'
                )}
              </Button>
            </Stack>
          </Box>

          <Box sx={{ marginTop: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="textSecondary">
              Нет аккаунта?{' '}
              <Link
                component="span"
                onClick={() => navigate('/register')}
                sx={{
                  color: '#1976d2',
                  cursor: 'pointer',
                  fontWeight: 600,
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                Зарегистрироваться
              </Link>
            </Typography>
          </Box>

          <Typography variant="body2" color="textSecondary" sx={{ marginTop: 3, textAlign: 'center' }}>
            © 2026 Система бронирования комнат
          </Typography>
        </Paper>
      </Box>
    </Container>
  )
}

export default LoginPage