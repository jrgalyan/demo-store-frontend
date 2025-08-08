import { useEffect, useState } from 'react'
import { ProductApi } from '../api/client.js'
import { Link } from 'react-router-dom'

export default function Home() {
  const [cats, setCats] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ProductApi.getRootCategories()
      .then(setCats)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <h1>Welcome to Demo Store</h1>
      <p className="muted">Search for products above or browse categories below.</p>
      <h2>Categories</h2>
      {loading ? <p>Loading…</p> : (
        <ul>
          {cats.map(c => (
            <li key={c.id}><Link to={`/categories/${c.id}`}>{c.name} {c.productCount != null && <span className="muted">({c.productCount})</span>}</Link></li>
          ))}
        </ul>
      )}
    </div>
  )
}
