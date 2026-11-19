import { useEffect, useState } from 'react'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import AddEvent from './pages/AddEvent'
import { getCurrentSession } from './apis/authApi'

function App() {
  const [page, setPage] = useState('login')
  const [authenticated, setAuthenticated] = useState(false)
  const [appPage, setAppPage] = useState('timeline')

  useEffect(() => {
    getCurrentSession()
      .then((session) => setAuthenticated(Boolean(session)))
      .catch(() => setAuthenticated(false))
  }, [])

  if (authenticated) {
    if (appPage === 'add-event') {
      return (
        <AddEvent
          onBack={() => setAppPage('timeline')}
          onCreated={() => setAppPage('timeline')}
        />
      )
    }

    return (
      <Home
        onLogout={() => setAuthenticated(false)}
        onAddEvent={() => setAppPage('add-event')}
      />
    )
  }

  return page === 'login'
    ? <Login onSwitch={() => setPage('register')} onLogin={() => setAuthenticated(true)} />
    : <Register onSwitch={() => setPage('login')} onRegister={() => setAuthenticated(true)} />
}

export default App
