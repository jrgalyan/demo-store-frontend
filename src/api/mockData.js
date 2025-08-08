// Mock data and API for Product Service endpoints
// This allows the app to work without a backend for demo purposes.

function delay(ms = 150) {
  return new Promise((res) => setTimeout(res, ms))
}

// Simple id generator for readability
const ids = {
  electronics: 'cat-electronics',
  books: 'cat-books',
  clothing: 'cat-clothing',
  phones: 'cat-phones',
  laptops: 'cat-laptops',
  fiction: 'cat-fiction',
}

const categories = [
  { id: ids.electronics, name: 'Electronics', description: 'Gadgets and devices', parentId: null, parentName: null, children: [], productCount: 0, isActive: true, createdAt: new Date().toISOString() },
  { id: ids.books, name: 'Books', description: 'Printed and digital books', parentId: null, parentName: null, children: [], productCount: 0, isActive: true, createdAt: new Date().toISOString() },
  { id: ids.clothing, name: 'Clothing', description: 'Apparel and accessories', parentId: null, parentName: null, children: [], productCount: 0, isActive: true, createdAt: new Date().toISOString() },
  // children
  { id: ids.phones, name: 'Mobile Phones', description: 'Smartphones and accessories', parentId: ids.electronics, parentName: 'Electronics', children: [], productCount: 0, isActive: true, createdAt: new Date().toISOString() },
  { id: ids.laptops, name: 'Laptops', description: 'Portable computers', parentId: ids.electronics, parentName: 'Electronics', children: [], productCount: 0, isActive: true, createdAt: new Date().toISOString() },
  { id: ids.fiction, name: 'Fiction', description: 'Novels and stories', parentId: ids.books, parentName: 'Books', children: [], productCount: 0, isActive: true, createdAt: new Date().toISOString() },
]

function getChildrenMap() {
  const map = new Map()
  categories.forEach((c) => {
    if (c.parentId) {
      if (!map.has(c.parentId)) map.set(c.parentId, [])
      map.get(c.parentId).push(c)
    }
  })
  return map
}

const products = [
  {
    id: 'prod-iphone-15',
    name: 'iPhone 15',
    description: 'Apple iPhone 15 with A16 Bionic, 128GB',
    sku: 'IP15-128-BLK',
    price: 799.0,
    category: categories.find(c => c.id === ids.phones),
    isActive: true,
    inStock: true,
  },
  {
    id: 'prod-pixel-8',
    name: 'Google Pixel 8',
    description: 'Pixel 8, 128GB, unlocked',
    sku: 'PX8-128-GRN',
    price: 699.0,
    category: categories.find(c => c.id === ids.phones),
    isActive: true,
    inStock: true,
  },
  {
    id: 'prod-macbook-air',
    name: 'MacBook Air 13" M3',
    description: 'Apple MacBook Air 13-inch with M3 chip, 8GB RAM, 256GB SSD',
    sku: 'MBA13-M3-256',
    price: 1099.0,
    category: categories.find(c => c.id === ids.laptops),
    isActive: true,
    inStock: true,
  },
  {
    id: 'prod-hoodie',
    name: 'Unisex Fleece Hoodie',
    description: 'Soft fleece hoodie in multiple colors',
    sku: 'HD-UNI-FLC',
    price: 49.99,
    category: categories.find(c => c.id === ids.clothing),
    isActive: true,
    inStock: false,
  },
  {
    id: 'prod-novel-1984',
    name: '1984 by George Orwell',
    description: 'Dystopian classic novel',
    sku: 'BK-1984',
    price: 12.5,
    category: categories.find(c => c.id === ids.fiction),
    isActive: true,
    inStock: true,
  },
]

// compute productCount for categories including parent accumulation
;(function attachCounts() {
  const counts = new Map()
  products.forEach((p) => {
    const catId = p.category?.id
    if (!catId) return
    counts.set(catId, (counts.get(catId) || 0) + 1)
  })
  // Roll up to parents
  const childrenMap = getChildrenMap()
  categories.forEach((c) => {
    let count = counts.get(c.id) || 0
    const kids = childrenMap.get(c.id) || []
    kids.forEach((k) => { count += counts.get(k.id) || 0 })
    c.productCount = count
  })
})()

function pageify(items, page = 0, size = 20) {
  const start = page * size
  const end = start + size
  return {
    content: items.slice(start, end),
    number: page,
    size,
    totalElements: items.length,
    totalPages: Math.max(1, Math.ceil(items.length / size)),
  }
}

export const MockProductApi = {
  async getRootCategories() {
    await delay()
    return categories.filter(c => !c.parentId)
  },
  async getCategory(id) {
    await delay()
    const c = categories.find(c => c.id === id)
    if (!c) throw Object.assign(new Error('Category not found'), { status: 404 })
    return c
  },
  async getCategoryChildren(id) {
    await delay()
    return categories.filter(c => c.parentId === id)
  },
  async searchCategories(q = '', page = 0, size = 20) {
    await delay()
    const term = String(q || '').toLowerCase()
    const filtered = categories.filter(c => !term || c.name.toLowerCase().includes(term) || c.description?.toLowerCase().includes(term))
    return pageify(filtered, Number(page) || 0, Math.min(Math.max(1, Number(size) || 20), 100))
  },
  async getProduct(id) {
    await delay()
    const p = products.find(p => p.id === id)
    if (!p) throw Object.assign(new Error('Product not found'), { status: 404 })
    return p
  },
  async getProductBySku(sku) {
    await delay()
    const p = products.find(p => p.sku === sku)
    if (!p) throw Object.assign(new Error('Product not found'), { status: 404 })
    return p
  },
  async listProducts(page = 0, size = 20) {
    await delay()
    return pageify(products, Number(page) || 0, Math.min(Math.max(1, Number(size) || 20), 100))
  },
  async searchProducts({ q, page = 0, size = 20, categoryId } = {}) {
    await delay()
    let list = products
    if (categoryId) list = list.filter(p => p.category?.id === categoryId)
    const term = String(q || '').toLowerCase()
    if (term) {
      list = list.filter(p =>
        p.name.toLowerCase().includes(term) ||
        p.description?.toLowerCase().includes(term) ||
        p.sku?.toLowerCase().includes(term)
      )
    }
    return pageify(list, Number(page) || 0, Math.min(Math.max(1, Number(size) || 20), 100))
  },
}
