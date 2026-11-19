import { useEffect, useState } from 'react'
import { getCurrentProfile, logoutAccount } from '../apis/authApi'
import { getTimelineDates } from '../apis/timelineDatesApi'
import TimelineHeader from '../components/TimelineHeader'
import TimelineFilters from '../components/TimelineFilters'
import SwimlaneTimeline from '../components/SwimlaneTimeline'
import GeneralTimeline from '../components/GeneralTimeline'
import { EVENT_OPTIONS, EVENT_TYPES, DEPARTMENT_TYPES } from '../constants/timelineOptions'
import './Home.css'

function Home({ onLogout, onAddDate }) {
  const [profile, setProfile] = useState(null)
  const [dates, setDates] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeScopes, setActiveScopes] = useState([])
  const [activeTypes, setActiveTypes] = useState([])
  const [onlyMine, setOnlyMine] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    Promise.all([getCurrentProfile(), getTimelineDates()])
      .then(([profileData, dateData]) => {
        setProfile(profileData)
        setDates(dateData)
      })
      .catch(() => setDates([]))
      .finally(() => setLoading(false))
  }, [])

  async function handleLogout() {
    await logoutAccount()
    onLogout()
  }

  function clearAllFilters() {
    setSearchQuery('')
    setActiveScopes([])
    setActiveTypes([])
    setOnlyMine(false)
  }

  function toggleScope(scopeId) {
    setActiveScopes((current) => current.includes(scopeId)
      ? current.filter((id) => id !== scopeId)
      : [...current, scopeId])
  }

  function toggleType(type) {
    setActiveTypes((current) => current.includes(type)
      ? current.filter((item) => item !== type)
      : [...current, type])
  }

  const initials = profile
    ? `${profile.first_name?.[0] || ''}${profile.last_name?.[0] || ''}`.toUpperCase()
    : 'TP'

  const scopes = EVENT_OPTIONS.map((event) => ({
    id: event.id,
    label: event.title,
    color: event.color || '#26776d',
  }))

  const types = [...new Set([...EVENT_TYPES, ...DEPARTMENT_TYPES])]

  const visibleDates = dates.filter((item) => {
    const scopeMatches = activeScopes.length === 0 || activeScopes.includes(item.scope_id)
    const typeMatches = activeTypes.length === 0 || activeTypes.includes(item.date_type)
    const mineMatches = !onlyMine || item.owner_id === profile?.id
    const searchMatches = !searchQuery.trim() || [
      item.title,
      item.location,
      item.notes,
      item.date_type,
    ].some((value) => String(value || '').toLowerCase().includes(searchQuery.trim().toLowerCase()))

    return scopeMatches && typeMatches && mineMatches && searchMatches
  })

  return (
    <main className="home-page">
      <TimelineHeader initials={initials} onAddDate={() => onAddDate?.()} onLogout={handleLogout} />

      <section className="timeline-content">
        <div className="timeline-heading">
          <div>
            <p className="home-kicker">Club schedule</p>
            <h1>Timeline for AY 26/27</h1>
          </div>
        </div>

        <TimelineFilters
          scopes={scopes}
          types={types}
          activeScopes={activeScopes}
          activeTypes={activeTypes}
          onToggleScope={toggleScope}
          onToggleType={toggleType}
          onlyMine={onlyMine}
          onOnlyMineChange={setOnlyMine}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onClearAll={clearAllFilters}
        />

        {loading ? (
          <p className="timeline-empty">Loading dates...</p>
        ) : visibleDates.length === 0 ? (
          <div className="timeline-empty">
            <p>No dates match the current filters.</p>
            <button type="button" onClick={() => onAddDate?.()}>Add the first date</button>
          </div>
        ) : (
          <GeneralTimeline
            items={visibleDates}
            scopes={scopes}
            onQuickAdd={onAddDate}
          />
        )}
      </section>
    </main>
  )
}

export default Home