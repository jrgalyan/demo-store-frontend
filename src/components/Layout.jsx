import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import './layout.css'

export default function Layout({ children }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function onSearchSubmit(e) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const q = formData.get('q')?.trim()
    navigate(q ? `/products?q=${encodeURIComponent(q)}` : '/products')
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <Link to="/" className="brand">Demo Store</Link>
        <nav className="nav">
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/categories">Categories</NavLink>
          <NavLink to="/products">Products</NavLink>
        </nav>
        <form className="search" onSubmit={onSearchSubmit} role="search" aria-label="Product search">
          <input name="q" placeholder="Search products" aria-label="Search products" />
          <button type="submit">Search</button>
        </form>
        <div className="auth">
          {user ? (
            <>
              <span className="welcome">Hi, {user.firstName || user.email}</span>
              <NavLink to="/profile">Profile</NavLink>
              <button type="button" onClick={() => { logout(); navigate('/') }}>Logout</button>
            </>
          ) : (
            <>
              <NavLink to="/login">Login</NavLink>
              <NavLink to="/register">Register</NavLink>
            </>
          )}
        </div>
      </header>
      <main className="app-main">{children}</main>
      <footer className="app-footer">© {new Date().getFullYear()} Demo Store</footer>
    </div>
  )
}
