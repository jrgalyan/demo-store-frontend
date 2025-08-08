import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Login() {
  const { login, setError, error } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)

  async function onSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await login(form)
      navigate('/profile')
    } catch (e) {
      setError(e.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1>Login</h1>
      {error && <p className="error" role="alert">{error}</p>}
      <form className="form" onSubmit={onSubmit}>
        <label>
          Email
          <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </label>
        <label>
          Password
          <input type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </label>
        <button type="submit" disabled={loading}>{loading ? 'Signing in…' : 'Login'}</button>
      </form>
      <p className="muted">Don’t have an account? <Link to="/register">Register</Link></p>
    </div>
  )
}
