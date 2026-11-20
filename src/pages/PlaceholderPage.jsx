import TimelineHeader from '../components/TimelineHeader'
import SideMenu from '../components/SideMenu'
import { useEffect, useState } from 'react'
import { getCurrentProfile } from '../apis/authApi'
import './PlaceholderPage.css'

function PlaceholderPage({ title, description, initials, onBack, onAddDate, onNavigate, onProfile }) {
  const [profile, setProfile] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    getCurrentProfile().then(setProfile).catch(() => setProfile(null))
  }, [])

  return (
    <main className="placeholder-page">
      <TimelineHeader initials={profile ? `${profile.first_name?.[0] || ''}${profile.last_name?.[0] || ''}`.toUpperCase() : initials} avatarUrl={profile?.avatar_url} onAddDate={onAddDate} onMenu={() => setMenuOpen(true)} onProfile={onProfile} />
      <SideMenu open={menuOpen} onClose={() => setMenuOpen(false)} onNavigate={(destination) => { setMenuOpen(false); onNavigate?.(destination) }} />
      <section className="placeholder-content">
        <button type="button" onClick={onBack}>← Back to timeline</button>
        <p className="placeholder-kicker">TPAC Timeline</p>
        <h1>{title}</h1>
        <p>{description}</p>
      </section>
    </main>
  )
}

export default PlaceholderPage
