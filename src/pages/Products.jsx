import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ProductApi } from '../api/client.js'
import ProductCard from '../components/ProductCard.jsx'
import Pagination from '../components/Pagination.jsx'

const DEFAULT_SIZE = 20
const MAX_SIZE = 100

export default function Products() {
  const [params, setParams] = useSearchParams()
  const [pageData, setPageData] = useState(null)
  const [loading, setLoading] = useState(true)
  const page = Number(params.get('page') || 0)
  const sizeRaw = Number(params.get('size') || DEFAULT_SIZE)
  const q = params.get('q') || ''
  const categoryId = params.get('categoryId') || ''
  const size = useMemo(() => Math.min(Math.max(1, sizeRaw), MAX_SIZE), [sizeRaw])

  useEffect(() => {
    setLoading(true)
    ProductApi.searchProducts({ q: q || undefined, page, size, categoryId: categoryId || undefined })
      .then(setPageData)
      .finally(() => setLoading(false))
  }, [q, page, size, categoryId])

  function onPageChange(newPage) {
    const next = new URLSearchParams(params)
    next.set('page', String(Math.max(0, newPage)))
    next.set('size', String(size))
    setParams(next)
  }

  return (
    <div>
      <h1>Products</h1>
      {q && <p className="muted">Showing results for “{q}”</p>}
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
