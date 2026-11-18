import { useEffect, useState } from 'react'
import { getCurrentProfile, logoutAccount } from '../apis/authApi'
import './Home.css'

function Home({ onLogout }) {
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    getCurrentProfile()
      .then(setProfile)
      .catch(() => setProfile(null))
  }, [])

  async function handleLogout() {
    await logoutAccount()
    onLogout()
  }

  const displayName = profile
    ? `${profile.first_name} ${profile.last_name}`.trim()
    : 'TPAC member'

  return (
    <main className="home-page">
      <section>
        <p className="home-kicker">TPAC Timeline</p>
        <h1>Welcome, {displayName}</h1>
        {profile?.club_role && <p>Role: {profile.club_role}</p>}
        <button type="button" onClick={handleLogout}>Log out</button>
      </section>
    </main>
  )
}

export default Home