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
  const [initialScope, setInitialScope] = useState(null)

  useEffect(() => {
    getCurrentSession()
      .then((session) => setAuthenticated(Boolean(session)))
      .catch(() => setAuthenticated(false))
  }, [])

  if (authenticated) {
    if (appPage === 'add-event') {
      return (
        <AddEvent
          onBack={() => {
            setInitialScope(null)
            setAppPage('timeline')
          }}
          onCreated={() => {
            setInitialScope(null)
            setAppPage('timeline')
          }}
          initialScope={initialScope}
        />
      )
    }

    return (
      <Home
        onLogout={() => setAuthenticated(false)}
        onAddDate={(scope) => {
          setInitialScope(scope || null)
          setAppPage('add-event')
        }}
      />
    )
  }

  return page === 'login'
    ? <Login onSwitch={() => setPage('register')} onLogin={() => setAuthenticated(true)} />
    : <Register onSwitch={() => setPage('login')} onRegister={() => setAuthenticated(true)} />
}

export default App
