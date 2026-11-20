import { useEffect, useState } from 'react'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import AddEvent from './pages/AddEvent'
import EditEvent from './pages/EditEvent'
import Profile from './pages/Profile'
import PlaceholderPage from './pages/PlaceholderPage'
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
          onProfile={() => setAppPage('profile')}
          onNavigate={(destination) => setAppPage(destination)}
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
          onProfile={() => setAppPage('profile')}
          onNavigate={(destination) => setAppPage(destination)}
          onUpdated={() => {
            setInitialScope(null)
            setEditItem(null)
            setAppPage('timeline')
          }}
        />
      )
    }

    if (appPage === 'profile') {
      return (
        <Profile
          onBack={() => setAppPage('timeline')}
          onLogout={() => setAuthenticated(false)}
          onAddDate={() => setAppPage('add-event')}
          onNavigate={(destination) => setAppPage(destination)}
          onProfile={() => setAppPage('profile')}
        />
      )
    }

    if (appPage === 'task-manager' || appPage === 'settings' || appPage === 'timetree') {
      const pages = {
        'task-manager': ['Task manager', 'Shared tasks will live here.'],
        settings: ['Settings', 'Workspace settings will live here.'],
        timetree: ['TimeTree calendar', 'TimeTree integration will live here.'],
      }
      return (
        <PlaceholderPage
          title={pages[appPage][0]}
          description={pages[appPage][1]}
          initials="TP"
          onBack={() => setAppPage('timeline')}
          onAddDate={() => setAppPage('add-event')}
          onProfile={() => setAppPage('profile')}
          onNavigate={(destination) => setAppPage(destination)}
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
        onProfile={() => setAppPage('profile')}
        onNavigate={(destination) => setAppPage(destination)}
      />
    )
  }

  return page === 'login'
    ? <Login onSwitch={() => setPage('register')} onLogin={() => setAuthenticated(true)} />
    : <Register onSwitch={() => setPage('login')} onRegister={() => setAuthenticated(true)} />
}

export default App
