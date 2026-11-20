import { useEffect, useState } from 'react'
import { deleteAccount, getCurrentProfile, logoutAccount, updateProfile, uploadProfileAvatar } from '../apis/authApi'
import TimelineHeader from '../components/TimelineHeader'
import './Profile.css'

function Profile({ onBack, onLogout }) {
  const [profile, setProfile] = useState(null)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [status, setStatus] = useState({ type: '', message: '' })

  useEffect(() => {
    getCurrentProfile().then((data) => {
      setProfile(data)
      setFirstName(data?.first_name || '')
      setLastName(data?.last_name || '')
      setAvatarUrl(data?.avatar_url || '')
    }).catch((error) => setStatus({ type: 'error', message: error.message }))
  }, [])

  async function saveProfile(event) {
    event.preventDefault()
    setStatus({ type: 'loading', message: 'Saving profile...' })
    try {
      const updated = await updateProfile({ firstName, lastName, avatarUrl })
      setProfile(updated)
      setStatus({ type: 'success', message: 'Profile updated.' })
    } catch (error) {
      setStatus({ type: 'error', message: error.message })
    }
  }

  async function handleAvatar(event) {
    const file = event.target.files?.[0]
    if (!file) return
    setStatus({ type: 'loading', message: 'Uploading picture...' })
    try {
      const url = await uploadProfileAvatar(file)
      setAvatarUrl(url)
      await updateProfile({ firstName, lastName, avatarUrl: url })
      setStatus({ type: 'success', message: 'Profile picture updated.' })
    } catch (error) {
      setStatus({ type: 'error', message: error.message })
    }
  }

  async function handleLogout() {
    await logoutAccount()
    onLogout()
  }

  async function handleDelete() {
    if (!window.confirm('Delete your account permanently? This cannot be undone.')) return
    try {
      await deleteAccount()
      onLogout()
    } catch (error) {
      setStatus({ type: 'error', message: error.message })
    }
  }

  return (
    <main className="profile-page">
      <TimelineHeader initials="" onAddDate={undefined} onLogout={handleLogout} onProfile={undefined} onMenu={undefined} />
      <section className="profile-content">
        <button type="button" className="profile-back" onClick={onBack}>← Back to timeline</button>
        <p className="profile-kicker">Account</p>
        <h1>Your profile</h1>
        <div className="profile-avatar-preview">
          {avatarUrl ? <img src={avatarUrl} alt="Profile" /> : <span>{`${firstName[0] || ''}${lastName[0] || ''}`.toUpperCase() || 'TP'}</span>}
        </div>
        <label className="avatar-upload">Change profile picture<input type="file" accept="image/*" onChange={handleAvatar} /></label>
        <form className="profile-form" onSubmit={saveProfile}>
          <label>First name<input value={firstName} onChange={(event) => setFirstName(event.target.value)} required /></label>
          <label>Last name<input value={lastName} onChange={(event) => setLastName(event.target.value)} required /></label>
          {status.message && <p className={`profile-status ${status.type}`}>{status.message}</p>}
          <button className="profile-save" type="submit">Save profile</button>
        </form>
        <div className="profile-actions">
          <button type="button" onClick={handleLogout}>Log out</button>
          <button type="button" className="delete-account" onClick={handleDelete}>Delete account</button>
        </div>
      </section>
    </main>
  )
}

export default Profile
