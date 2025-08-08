const ORIGIN = typeof window !== 'undefined' ? window.location.origin : 'http://localhost'
const USER_API_BASE = import.meta.env.VITE_USER_API_BASE || ORIGIN
const PRODUCT_API_BASE = import.meta.env.VITE_PRODUCT_API_BASE || ORIGIN

// Simple safe fetch wrapper with credentials for HttpOnly cookie auth
export async function apiFetch(path, { base = 'user', method = 'GET', headers = {}, body, signal, query } = {}) {
  const baseUrl = base === 'product' ? PRODUCT_API_BASE : USER_API_BASE
  const url = new URL(path.startsWith('/') ? path : `/${path}`, baseUrl)

  if (query && typeof query === 'object') {
    Object.entries(query).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, String(v))
    })
  }

  const init = {
    method,
    headers: {
      'Content-Type': body ? 'application/json' : undefined,
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
    credentials: 'include', // send cookies for auth
    signal,
  }

  // Remove undefined headers (fetch may send them otherwise)
  Object.keys(init.headers).forEach((k) => init.headers[k] === undefined && delete init.headers[k])

  const res = await fetch(url, init)
  const isJson = res.headers.get('content-type')?.includes('application/json')
  const data = isJson ? await res.json().catch(() => null) : null

  if (!res.ok) {
    const message = data?.message || data?.error || res.statusText
    const err = new Error(message)
    err.status = res.status
    err.data = data
    throw err
  }
  return data
}

export const UserApi = {
  me: (signal) => apiFetch('/api/v1/users/me', { base: 'user', signal }),
  updateMe: (payload) => apiFetch('/api/v1/users/me', { base: 'user', method: 'PUT', body: payload }),
  deleteMe: () => apiFetch('/api/v1/users/me', { base: 'user', method: 'DELETE' }),
  login: (payload) => apiFetch('/api/v1/users/login', { base: 'user', method: 'POST', body: payload }),
  register: (payload) => apiFetch('/api/v1/users/register', { base: 'user', method: 'POST', body: payload }),
}

import { MockProductApi } from './mockData.js'

const USE_MOCK_PRODUCT = (import.meta.env?.VITE_USE_MOCK_PRODUCT ?? 'true') !== 'false'

export const ProductApi = USE_MOCK_PRODUCT ? MockProductApi : {
  getRootCategories: () => apiFetch('/api/v1/categories/root', { base: 'product' }),
  getCategory: (id) => apiFetch(`/api/v1/categories/${encodeURIComponent(id)}`, { base: 'product' }),
  getCategoryChildren: (id) => apiFetch(`/api/v1/categories/${encodeURIComponent(id)}/children`, { base: 'product' }),
  searchCategories: (q, page, size) => apiFetch('/api/v1/categories/search', { base: 'product', query: { q, page, size } }),
  getProduct: (id) => apiFetch(`/api/v1/products/${encodeURIComponent(id)}`, { base: 'product' }),
  getProductBySku: (sku) => apiFetch(`/api/v1/products/sku/${encodeURIComponent(sku)}`, { base: 'product' }),
  listProducts: (page, size) => apiFetch('/api/v1/products', { base: 'product', query: { page, size } }),
  searchProducts: ({ q, page, size, categoryId }) => {
    if (categoryId) return apiFetch(`/api/v1/products/category/${encodeURIComponent(categoryId)}`, { base: 'product', query: { page, size } })
    if (q) return apiFetch('/api/v1/products/search', { base: 'product', query: { q, page, size } })
    return apiFetch('/api/v1/products', { base: 'product', query: { page, size } })
  },
}

export const PHONE_E164_REGEX = /^\+?[1-9]\d{1,14}$/
