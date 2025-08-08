import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ProductApi } from '../api/client.js'

export default function ProductDetail() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    ProductApi.getProduct(id)
      .then(setProduct)
      .catch((e) => setError(e.message || 'Failed to load product'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <p>Loading…</p>
  if (error) return <p className="error">{error}</p>
  if (!product) return <p>Not found</p>

  return (
    <article>
      <h1>{product.name}</h1>
      <p className="muted">SKU: {product.sku}</p>
      <p>{product.description}</p>
      <p><strong>Price:</strong> ${product.price?.toFixed?.(2) ?? product.price}</p>
      <p><strong>Status:</strong> {product.inStock ? 'In stock' : 'Out of stock'}</p>
    </article>
  )
}
