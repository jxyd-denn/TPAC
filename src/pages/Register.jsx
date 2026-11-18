import { useState } from 'react'
import AuthLayout from '../components/AuthLayout'
import './Register.css'

function Register({ onSwitch }) {
  const [showPassword, setShowPassword] = useState(false)

  function handleSubmit(event) {
    event.preventDefault()
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
                <input id="first-name" type="text" placeholder="Jayden" required />
              </div>
            </div>
            <div>
              <label className="field-label" htmlFor="last-name">Last name</label>
              <div className="input-wrap plain-input">
                <input id="last-name" type="text" placeholder="Tan" required />
              </div>
            </div>
          </div>

          <label className="field-label" htmlFor="register-email">Email address</label>
          <div className="input-wrap">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6.5A2.5 2.5 0 0 1 5.5 4h13A2.5 2.5 0 0 1 21 6.5v11a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 17.5v-11Z"/><path d="m4 6 8 6 8-6"/></svg>
            <input id="register-email" type="email" placeholder="you@example.com" required />
          </div>

          <label className="field-label" htmlFor="club-role">Club role</label>
          <div className="input-wrap plain-input">
            <select id="club-role" defaultValue="" required>
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
            <input id="register-password" type={showPassword ? 'text' : 'password'} placeholder="Create a password" minLength="8" required />
            <button className="show-password" type="button" onClick={() => setShowPassword((shown) => !shown)}>{showPassword ? 'Hide' : 'Show'}</button>
          </div>

          <label className="terms-row">
            <input type="checkbox" required />
            <span>I agree to the <button type="button">Terms of Use</button> and <button type="button">Privacy Policy</button>.</span>
          </label>

          <button className="primary-button" type="submit">Create account <span aria-hidden="true">→</span></button>
        </form>

        <p className="switch-copy">Already have an account? <button type="button" onClick={onSwitch}>Sign in</button></p>
      </div>
    </AuthLayout>
  )
}

export default Register
