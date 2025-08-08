import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { PHONE_E164_REGEX } from '../api/client.js'

export default function Register() {
  const { register, setError, error } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '', firstName: '', lastName: '', phone: '' })
  const [loading, setLoading] = useState(false)
  const phoneValid = !form.phone || PHONE_E164_REGEX.test(form.phone)

  async function onSubmit(e) {
    e.preventDefault()
    if (!phoneValid) return
    setLoading(true)
    setError(null)
    try {
      await register(form)
      // After register, direct to login for explicit sign-in (cookie not guaranteed on register)
      navigate('/login')
    } catch (e) {
      setError(e.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1>Register</h1>
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
        <label>
          First name
          <input required value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
        </label>
        <label>
          Last name
          <input required value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
        </label>
        <label>
          Phone (E.164)
          <input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} aria-invalid={!phoneValid} />
          {!phoneValid && <span className="error">Phone must match E.164 format (e.g., +123456789)</span>}
        </label>
        <button type="submit" disabled={loading || !phoneValid}>{loading ? 'Creating…' : 'Create account'}</button>
      </form>
      <p className="muted">Already have an account? <Link to="/login">Login</Link></p>
    </div>
  )
}
