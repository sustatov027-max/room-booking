import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material'

const RegisterPage = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [repeatPassword, setRepeatPassword] = useState('')
  const [role, setRole] = useState('user')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()

  const handleRegister = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (loading) return

    setError('')
    setLoading(true)

    if (password !== repeatPassword) {
        setError('Пароли не совпадают.')
        setLoading(false)
        return
    }

    try {
      const response = await fetch('http://localhost:8080/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ name, email, password, role }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(true)
        setTimeout(() => {
          navigate('/login')
        }, 1000)
      } else {
        setError(data.message || 'Ошибка регистрации. Проверьте данные.')
      }
    } catch (error) {
      console.error('Ошибка:', error)
      setError('Ошибка регистрации. Проверьте соединение с сервером.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    document.title = 'Регистрация'
  }, [])

  if (success) {
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
            <Alert severity="success" sx={{ width: '100%', marginBottom: 2 }}>
              Регистрация успешна! Перенаправление на страницу входа...
            </Alert>
            <CircularProgress />
          </Paper>
        </Box>
      </Container>
    )
  }

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
          <img 
                src="/company.png"
                style={{ height: '50px', width: 'auto', marginBottom: 5 }}
          />

          <Typography component="h1" variant="h4" sx={{ marginBottom: 3, fontWeight: 600 }}>
            Регистрация
          </Typography>

          <Typography variant="body2" color="textSecondary" sx={{ marginBottom: 3, textAlign: 'center' }}>
            Создайте новый аккаунт
          </Typography>

          {error && (
            <Alert severity="error" sx={{ width: '100%', marginBottom: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleRegister} sx={{ width: '100%' }}>
            <Stack spacing={2}>
              <TextField
                fullWidth
                label="Имя"
                type="text"
                placeholder="Иван Иванов"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
                required
                variant="outlined"
                autoFocus
              />

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

              <TextField
                fullWidth
                label="Подтверждение пароля"
                type="password"
                placeholder="••••••••"
                value={repeatPassword}
                onChange={(e) => setRepeatPassword(e.target.value)}
                disabled={loading}
                required
                variant="outlined"
              />   

              <FormControl fullWidth>
                <InputLabel>Роль</InputLabel>
                <Select
                  value={role}
                  label="Роль"
                  onChange={(e) => setRole(e.target.value)}
                  disabled={loading}
                >
                  <MenuItem value="user">Пользователь</MenuItem>
                  <MenuItem value="admin">Администратор</MenuItem>
                </Select>
              </FormControl>

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
                    Регистрация...
                  </Box>
                ) : (
                  'Зарегистрироваться'
                )}
              </Button>
            </Stack>
          </Box>

          <Box sx={{ marginTop: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="textSecondary">
              Уже есть аккаунт?{' '}
              <Link
                component="span"
                onClick={() => navigate('/login')}
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
                Войти
              </Link>
            </Typography>
          </Box>

          <Typography variant="body2" color="textSecondary" sx={{ marginTop: 3, textAlign: 'center' }}>
            © 2026 RB-automatics
          </Typography>
        </Paper>
      </Box>
    </Container>
  )
}

export default RegisterPage