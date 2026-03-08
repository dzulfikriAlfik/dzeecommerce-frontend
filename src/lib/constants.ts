/**
 * Application-wide constants.
 * Never store secrets here — only public, non-sensitive values.
 */

// ── Route paths ──────────────────────────────────────────────────────────────

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  PRODUCTS: '/products',
  PRODUCT_DETAIL: (slug: string) => `/products/${slug}` as const,
  CART: '/cart',
  CHECKOUT: '/checkout',
  ORDERS: '/orders',
  ORDER_DETAIL: (id: string) => `/orders/${id}` as const,
  ADMIN: '/admin',
  ADMIN_PRODUCTS: '/admin/products',
  ADMIN_ORDERS: '/admin/orders',
  ADMIN_PAYMENTS: '/admin/payments',
} as const;

// ── API endpoints ────────────────────────────────────────────────────────────

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    ME: '/auth/me',
  },
  PRODUCTS: {
    LIST: '/products',
    DETAIL: (slug: string) => `/products/${slug}`,
  },
  CART: {
    GET: '/cart',
    ADD: '/cart/items',
    UPDATE: (itemId: string) => `/cart/items/${itemId}`,
    REMOVE: (itemId: string) => `/cart/items/${itemId}`,
  },
  CHECKOUT: { CREATE: '/checkout' },
  ORDERS: {
    LIST: '/orders',
    DETAIL: (id: string) => `/orders/${id}`,
  },
  PAYMENTS: {
    INITIATE: (orderId: string) => `/orders/${orderId}/payments`,
  },
} as const;

// ── Query keys ───────────────────────────────────────────────────────────────

export const QUERY_KEYS = {
  AUTH: { ME: ['auth', 'me'] as const },
  PRODUCTS: {
    LIST: ['products'] as const,
    DETAIL: (slug: string) => ['products', slug] as const,
  },
  CART: { GET: ['cart'] as const },
  ORDERS: {
    LIST: ['orders'] as const,
    DETAIL: (id: string) => ['orders', id] as const,
  },
} as const;

// ── UI constants ──────────────────────────────────────────────────────────────

export const UI = {
  TOAST_DURATION: 4000,
  DEBOUNCE_DELAY: 300,
  PAGINATION_DEFAULT_LIMIT: 20,
} as const;

// ── Roles ────────────────────────────────────────────────────────────────────

export const ROLES = {
  GUEST: 'guest',
  CUSTOMER: 'customer',
  CUSTOMER_SUPPORT: 'customer_support',
  WAREHOUSE: 'warehouse',
  FINANCE: 'finance',
  ADMIN: 'admin',
  SUPER_ADMIN: 'super_admin',
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];
