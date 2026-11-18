import './AuthLayout.css'

function AuthLayout({ children, variant = 'login' }) {
  return (
    <main className="auth-shell">
      <section className={`auth-panel ${variant}`}>
        {children}
      </section>
    </main>
  )
}

export default AuthLayout
