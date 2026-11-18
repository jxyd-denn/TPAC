import { useEffect, useState } from 'react'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import { getCurrentSession } from './apis/authApi'

function App() {
  const [page, setPage] = useState('login')
  const [authenticated, setAuthenticated] = useState(false)

  useEffect(() => {
    getCurrentSession()
      .then((session) => setAuthenticated(Boolean(session)))
      .catch(() => setAuthenticated(false))
  }, [])

  if (authenticated) {
    return <Home onLogout={() => setAuthenticated(false)} />
  }

  return page === 'login'
    ? <Login onSwitch={() => setPage('register')} onLogin={() => setAuthenticated(true)} />
    : <Register onSwitch={() => setPage('login')} onRegister={() => setAuthenticated(true)} />
}

export default App
