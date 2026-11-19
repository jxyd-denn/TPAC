import { useEffect, useState } from 'react'
import { getCurrentProfile, logoutAccount } from '../apis/authApi'
import { getEvents } from '../apis/eventsApi'
import './Home.css'

function Home({ onLogout, onAddEvent }) {
  const [profile, setProfile] = useState(null)
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getCurrentProfile(), getEvents()])
      .then(([profileData, eventData]) => {
        setProfile(profileData)
        setEvents(eventData)
      })
      .catch(() => setEvents([]))
      .finally(() => setLoading(false))
  }, [])

  async function handleLogout() {
    await logoutAccount()
    onLogout()
  }

  const initials = profile
    ? `${profile.first_name?.[0] || ''}${profile.last_name?.[0] || ''}`.toUpperCase()
    : 'TP'

  return (
    <main className="home-page">
      <header className="timeline-header">
        <div className="timeline-brand">
          <span className="brand-icon" aria-hidden="true">△</span>
          <span>TPAC Timeline</span>
        </div>

        <div className="header-actions">
          <button type="button" className="add-event-button" onClick={onAddEvent}>+ Add event</button>
          <button type="button" className="header-avatar" onClick={handleLogout} aria-label="Log out">{initials}</button>
        </div>
      </header>

      <section className="timeline-content">
        <div className="timeline-heading">
          <div>
            <p className="home-kicker">Club schedule</p>
            <h1>Event timeline</h1>
          </div>
        </div>

        {loading ? (
          <p className="timeline-empty">Loading events...</p>
        ) : events.length === 0 ? (
          <div className="timeline-empty">
            <p>No events scheduled yet.</p>
            <button type="button" onClick={onAddEvent}>Create the first event</button>
          </div>
        ) : (
          <div className="timeline-list">
            {events.map((item) => {
              const date = new Date(`${item.event_date}T00:00:00`)

              return (
                <article className="timeline-item" key={item.id}>
                  <div className="timeline-date">
                    <span>{date.toLocaleDateString('en-SG', { month: 'short' }).toUpperCase()}</span>
                    <strong>{date.getDate()}</strong>
                  </div>

                  <div className="timeline-track" aria-hidden="true">
                    <span style={{ background: item.color }} />
                  </div>

                  <div className="timeline-card" style={{ borderLeftColor: item.color }}>
                    <div>
                      <h2>{item.title}</h2>
                      {item.description && <p>{item.description}</p>}
                    </div>
                    <span className="event-color-dot" style={{ background: item.color }} />
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </section>
    </main>
  )
}

export default Home