import { useState } from 'react'
import AuthLayout from '../components/AuthLayout'
import './Login.css'

function Login({ onSwitch }) {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
  }

  return (
    <AuthLayout variant="login">
      <div className="auth-form-wrap">
        <div className="auth-heading">
          <p className="auth-kicker">Welcome back</p>
          <h2>Sign in to your account</h2>
          <p>Continue planning your next adventure.</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="field-label" htmlFor="login-email">Email address</label>
          <div className="input-wrap">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6.5A2.5 2.5 0 0 1 5.5 4h13A2.5 2.5 0 0 1 21 6.5v11a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 17.5v-11Z"/><path d="m4 6 8 6 8-6"/></svg>
            <input id="login-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" required />
          </div>

          <div className="label-row">
            <label className="field-label" htmlFor="login-password">Password</label>
            <button className="text-button" type="button">Forgot password?</button>
          </div>
          <div className="input-wrap">
            <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="10" width="16" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>
            <input id="login-password" type={showPassword ? 'text' : 'password'} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter your password" required />
            <button className="show-password" type="button" onClick={() => setShowPassword((shown) => !shown)} aria-label={showPassword ? 'Hide password' : 'Show password'}>
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>

          <label className="remember-row">
            <input type="checkbox" />
            <span>Keep me signed in</span>
          </label>

          <button className="primary-button" type="submit">Sign in <span aria-hidden="true">→</span></button>
        </form>

        <p className="switch-copy">New to TPAC Timeline? <button type="button" onClick={onSwitch}>Create an account</button></p>
      </div>
    </AuthLayout>
  )
}

export default Login
