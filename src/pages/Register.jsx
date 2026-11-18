import { useState } from 'react'
import AuthLayout from '../components/AuthLayout'
import { registerAccount } from '../apis/authApi'
import './Register.css'

function Register({ onSwitch, onRegister }) {
  const [showPassword, setShowPassword] = useState(false)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [clubRole, setClubRole] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState({ type: '', message: '' })

  async function handleSubmit(event) {
    event.preventDefault()
    setStatus({ type: '', message: '' })
    setStatus({ type: 'loading', message: 'Creating account...' })

    try {
      const result = await registerAccount({
        email,
        password,
        firstName,
        lastName,
        clubRole,
      })

      if (result.session) {
        onRegister?.()
        return
      }

      setStatus({
        type: 'success',
        message: 'Account created. Check your email to confirm it before signing in.',
      })
    } catch (error) {
      setStatus({ type: 'error', message: error.message })
    }
  }

  return (
    <AuthLayout variant="register">
      <div className="auth-form-wrap register-form-wrap">
        <div className="auth-heading">
          <p className="auth-kicker">Join the club</p>
          <h2>Create your account</h2>
          <p>Start organizing events, tasks, and trip details.</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="name-grid">
            <div>
              <label className="field-label" htmlFor="first-name">First name</label>
              <div className="input-wrap plain-input">
                <input id="first-name" type="text" value={firstName} onChange={(event) => setFirstName(event.target.value)} placeholder="Jayden" required />
              </div>
            </div>
            <div>
              <label className="field-label" htmlFor="last-name">Last name</label>
              <div className="input-wrap plain-input">
                <input id="last-name" type="text" value={lastName} onChange={(event) => setLastName(event.target.value)} placeholder="Ngai" required />
              </div>
            </div>
          </div>

          <label className="field-label" htmlFor="register-email">Email address</label>
          <div className="input-wrap">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6.5A2.5 2.5 0 0 1 5.5 4h13A2.5 2.5 0 0 1 21 6.5v11a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 17.5v-11Z"/><path d="m4 6 8 6 8-6"/></svg>
            <input id="register-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" required />
          </div>

          <label className="field-label" htmlFor="club-role">Club role</label>
          <div className="input-wrap plain-input">
            <select id="club-role" value={clubRole} onChange={(event) => setClubRole(event.target.value)} required>
              <option value="" disabled>Select your role</option>
              <option>MC</option>
              <option>Committee Member</option>
              <option>Instructor</option>
              <option>Member</option>
            </select>
          </div>

          <label className="field-label" htmlFor="register-password">Password</label>
          <div className="input-wrap">
            <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="10" width="16" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>
            <input id="register-password" type={showPassword ? 'text' : 'password'} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Create a password" minLength="8" required />
            <button className="show-password" type="button" onClick={() => setShowPassword((shown) => !shown)}>{showPassword ? 'Hide' : 'Show'}</button>
          </div>

          {status.message && <p className={`auth-status ${status.type}`}>{status.message}</p>}
          <button className="primary-button" type="submit" disabled={status.type === 'loading'}>
            {status.type === 'loading' ? 'Creating account...' : 'Create account'} <span aria-hidden="true">→</span>
          </button>
        </form>

        <p className="switch-copy">Already have an account? <button type="button" onClick={onSwitch}>Sign in</button></p>
      </div>
    </AuthLayout>
  )
}

export default Register
