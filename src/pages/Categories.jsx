import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ProductApi } from '../api/client.js'

export default function Categories() {
  const [cats, setCats] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ProductApi.getRootCategories()
      .then(setCats)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <h1>Categories</h1>
      {loading ? <p>Loading…</p> : (
        <ul>
          {cats.map(c => (
            <li key={c.id}><Link to={`/categories/${c.id}`}>{c.name}</Link> {c.description && <span className="muted">— {c.description}</span>}</li>
          ))}
        </ul>
      )}
    </div>
  )
}
