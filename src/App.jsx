import { useEffect, useState } from 'react'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import AddEvent from './pages/AddEvent'
import EditEvent from './pages/EditEvent'
import { getCurrentSession } from './apis/authApi'

function App() {
  const [page, setPage] = useState('login')
  const [authenticated, setAuthenticated] = useState(false)
  const [appPage, setAppPage] = useState('timeline')
  const [initialScope, setInitialScope] = useState(null)
  const [editItem, setEditItem] = useState(null)

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
            setEditItem(null)
            setAppPage('timeline')
          }}
          onCreated={() => {
            setInitialScope(null)
            setEditItem(null)
            setAppPage('timeline')
          }}
          initialScope={initialScope}
        />
      )
    }

    if (appPage === 'edit-event') {
      return (
        <EditEvent
          editItem={editItem}
          onBack={() => {
            setInitialScope(null)
            setEditItem(null)
            setAppPage('timeline')
          }}
          onBackToAdd={() => {
            setInitialScope(null)
            setEditItem(null)
            setAppPage('add-event')
          }}
          onUpdated={() => {
            setInitialScope(null)
            setEditItem(null)
            setAppPage('timeline')
          }}
        />
      )
    }

    return (
      <Home
        onLogout={() => setAuthenticated(false)}
        onAddDate={(scope) => {
          if (scope?.editItem) {
            setInitialScope(scope)
            setEditItem(scope.editItem)
            setAppPage('edit-event')
            return
          }
          setInitialScope(scope || null)
          setEditItem(null)
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
