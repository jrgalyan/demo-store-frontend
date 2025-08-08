export default function ProductCard({ product }) {
  return (
    <div className="card" aria-label={`Product ${product.name}`}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'start', gap:8}}>
        <div>
          <div style={{fontWeight:600}}>{product.name}</div>
          {product.category?.name && <div className="muted">{product.category.name}</div>}
        </div>
        <div style={{fontWeight:700}}>${product.price?.toFixed?.(2) ?? product.price}</div>
      </div>
      {product.description && <p className="muted" style={{marginTop:8}}>{product.description}</p>}
      <div className="actions" style={{marginTop:8}}>
        <a href={`/products/${product.id}`}>View</a>
        {product.sku && <span className="muted">SKU: {product.sku}</span>}
        {product.inStock ? <span>In stock</span> : <span>Out of stock</span>}
      </div>
    </div>
  )
}
