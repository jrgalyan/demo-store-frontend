import { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { PHONE_E164_REGEX, UserApi } from '../api/client.js'

export default function Profile() {
  const { user, setUser } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', firstName: '', lastName: '', phone: '' })
  const [loading, setLoading] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState('')
  const [error, setError] = useState(null)

  useEffect(() => {
    if (user) {
      setForm({
        email: user.email || '',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || '',
      })
    }
  }, [user])

  if (!user) return <Navigate to="/login" replace />

  const phoneValid = !form.phone || PHONE_E164_REGEX.test(form.phone)

  async function onUpdate(e) {
    e.preventDefault()
    if (!phoneValid) return
    setLoading(true)
    setError(null)
    try {
      const updated = await UserApi.updateMe(form)
      setUser(updated)
    } catch (e) {
      setError(e.message || 'Update failed')
    } finally {
      setLoading(false)
    }
  }

  async function onDelete(e) {
    e.preventDefault()
    if (deleteConfirm !== user.email) return setError('Please type your email to confirm deletion')
    setLoading(true)
    setError(null)
    try {
      await UserApi.deleteMe()
      // Redirect to home after deletion
      navigate('/')
    } catch (e) {
      setError(e.message || 'Delete failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1>Profile</h1>
      {error && <p className="error" role="alert">{error}</p>}
      <form className="form" onSubmit={onUpdate}>
        <label>
          Email
          <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
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
        <button type="submit" disabled={loading || !phoneValid}>{loading ? 'Saving…' : 'Save changes'}</button>
      </form>

      <hr style={{margin:'1.5rem 0'}} />

      <h2>Delete account</h2>
      <p className="muted">Type your email <strong>{user.email}</strong> to confirm account deletion. This action is irreversible.</p>
      <form className="form" onSubmit={onDelete}>
        <label>
          Confirm email
          <input value={deleteConfirm} onChange={(e) => setDeleteConfirm(e.target.value)} />
        </label>
        <button type="submit" disabled={loading || deleteConfirm !== user.email}>Delete my account</button>
      </form>
    </div>
  )
}
