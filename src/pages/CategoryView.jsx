import { useEffect, useMemo, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { ProductApi } from '../api/client.js'
import ProductCard from '../components/ProductCard.jsx'
import Pagination from '../components/Pagination.jsx'

const DEFAULT_SIZE = 20
const MAX_SIZE = 100

export default function CategoryView() {
  const { id } = useParams()
  const [params, setParams] = useSearchParams()
  const [cat, setCat] = useState(null)
  const [children, setChildren] = useState([])
  const [pageData, setPageData] = useState(null)
  const [loading, setLoading] = useState(true)

  const page = Number(params.get('page') || 0)
  const sizeRaw = Number(params.get('size') || DEFAULT_SIZE)
  const size = useMemo(() => Math.min(Math.max(1, sizeRaw), MAX_SIZE), [sizeRaw])

  useEffect(() => {
    setLoading(true)
    Promise.all([
      ProductApi.getCategory(id).then(setCat),
      ProductApi.getCategoryChildren(id).then(setChildren),
      ProductApi.searchProducts({ categoryId: id, page, size }).then(setPageData),
    ]).finally(() => setLoading(false))
  }, [id, page, size])

  function onPageChange(newPage) {
    const next = new URLSearchParams(params)
    next.set('page', String(Math.max(0, newPage)))
    next.set('size', String(size))
    setParams(next)
  }

  if (loading && !cat) return <p>Loading…</p>

  return (
    <div>
      <h1>{cat?.name || 'Category'}</h1>
      {cat?.description && <p className="muted">{cat.description}</p>}
      {!!children.length && (
        <div>
          <h3>Subcategories</h3>
          <ul>
            {children.map((c) => (
              <li key={c.id}><Link to={`/categories/${c.id}`}>{c.name}</Link></li>
            ))}
          </ul>
        </div>
      )}
      <h3>Products</h3>
      {loading ? <p>Loading…</p> : (
        <>
          <div className="grid">
            {pageData?.content?.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
          <Pagination page={pageData?.number || 0} totalPages={pageData?.totalPages || 0} onPageChange={onPageChange} />
        </>
      )}
    </div>
  )
}
