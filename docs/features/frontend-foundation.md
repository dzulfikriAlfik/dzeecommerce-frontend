# Feature: Frontend Foundation (F1 + F2)

## Status: ✅ Completed

## Summary

Base frontend project scaffold for Dzeecommerce — a production-grade e-commerce platform.
Covers the Next.js scaffold (F1) and shared architecture baseline (F2): API client,
TanStack Query provider, Zustand auth state, and reusable utilities.

## File Mapping to Task Plan

| Task Plan Path | Actual Path | Rationale |
| --- | --- | --- |
| `src/app/query-client.ts` | `src/lib/query-client.ts` | `lib/` is the standard location for non-page utilities |
| `src/stores/auth.store.ts` | `src/store/auth.store.ts` | Singular `store/` follows Zustand convention |

All other file paths match the task plan exactly.

## Tech Stack

| Technology      | Version | Purpose                        |
| --------------- | ------- | ------------------------------ |
| Next.js         | 15.x    | App Router, SSR, file routing  |
| React           | 19.x    | UI library                     |
| TypeScript      | 5.7+    | Strict type safety             |
| TailwindCSS     | 3.4     | Utility-first CSS              |
| TanStack Query  | 5.62+   | Server state & caching         |
| Zustand         | 5.x     | Client state management        |
| Axios           | 1.7+    | HTTP client with interceptors  |
| Sonner          | 1.7+    | Toast notifications            |
| Zod             | 3.24+   | Runtime validation             |
| Vitest          | 2.1+    | Unit & component testing       |

## Architecture

```
src/
├── app/            # Next.js App Router pages & layouts
├── components/     # Shared UI components
│   ├── ui/         # Primitives: Button, Card, Input, Modal, etc.
│   ├── layout/     # Navbar, Sidebar, Footer, ProtectedLayout
│   ├── feedback/   # ErrorBoundary, EmptyState, PlaceholderFeature
│   └── providers/  # ThemeProvider
├── features/       # Feature-scoped modules (future)
├── hooks/          # Custom React hooks
├── lib/            # Core utilities: axios, query-client, websocket, env
├── services/       # API & WebSocket service layers
├── store/          # Zustand stores: auth, ui, notification
├── types/          # TypeScript type definitions
└── utils/          # Pure utility functions
```

## Key Design Decisions

1. **httpOnly Cookie Auth** — Tokens stored in cookies, not localStorage. Axios interceptor handles 401 → refresh queue automatically.
2. **WebSocket Client** — Custom class with exponential backoff reconnect (max 10 attempts).
3. **Glassmorphism Design System** — `backdrop-blur-xl bg-white/10 border-white/20` on cards, dark mode via Tailwind `class` strategy.
4. **Sonner over react-hot-toast** — Better animations, native dark mode, smaller bundle (~4KB), modern promise API.
5. **Placeholder UI** — All unimplemented features show a consistent "Feature currently under development" placeholder.
6. **Mobile-First Responsive** — All components built mobile-first with responsive breakpoints.

## Validation

- ✅ `npm run lint` — No warnings or errors
- ✅ `npm run typecheck` — Zero TypeScript errors
- ✅ `npm run test` — 11 tests passing (3 suites)
- ✅ `npm run build` — Production build successful (11 static pages)

## Pages

| Route       | Status      | Description          |
| ----------- | ----------- | -------------------- |
| `/`         | Implemented | Home with hero + bento grid |
| `/login`    | Placeholder | Login form           |
| `/register` | Placeholder | Registration form    |
| `/products` | Placeholder | Product catalog      |
| `/cart`     | Placeholder | Shopping cart        |
| `/checkout` | Placeholder | Checkout flow        |
| `/orders`   | Placeholder | Order history        |
| `/admin`    | Placeholder | Admin dashboard      |

## Components

### UI Primitives
- `Button` — variants: primary, secondary, outline, ghost, danger; sizes: sm, md, lg; loading state
- `Card` — variants: glass, solid, outlined; hover effect; sub-components (Header, Title, Content, Footer)
- `Input` — label, error, hint, accessible ARIA
- `Modal` — backdrop, escape close, body scroll lock, size variants
- `Skeleton` / `SkeletonCard` / `SkeletonRow` — loading placeholders
- `Spinner` / `PageSpinner` — loading indicators
- `Badge` — variants: default, success, warning, error, info

### Layout
- `Navbar` — sticky, logo, nav links, dark mode toggle, notification bell, auth buttons
- `Sidebar` — mobile slide-out with overlay, responsive desktop static
- `Footer` — logo, links, copyright
- `ProtectedLayout` — auth guard with role checking

### Feedback
- `ErrorBoundary` — class component with retry
- `EmptyState` — configurable icon, title, description, action
- `PlaceholderFeature` — "Under development" placeholder

## Role Documentation

The foundation layer is shared infrastructure — all roles interact with it indirectly.

| Role | Can Do | Cannot Do |
| --- | --- | --- |
| `guest` | View public pages (home, products, login, register). Axios client sends unauthenticated requests. | Access protected routes. Auth store has no user. |
| `customer` | Full storefront access. Auth store holds session. Cookie-based auth auto-refreshes on 401. | Access admin area. |
| `customer_support` | Access support-scoped admin views (future). Auth store + role check gates visibility. | Access warehouse, finance, or super-admin features. |
| `warehouse` | Access warehouse-scoped admin views (future). | Access finance, support, or super-admin features. |
| `finance` | Access finance-scoped admin views (future). | Access warehouse, support, or super-admin features. |
| `admin` | Access all admin operational views. | Access super-admin system configuration. |
| `super_admin` | Full system access including admin configuration. | N/A — highest privilege. |

### UI Visibility Rules
- `Navbar`: auth buttons (Login/Register) shown for guests; user menu shown for authenticated users
- `Sidebar`: navigation links filtered by `hasRole()` from auth store
- `ProtectedLayout`: redirects unauthenticated users; shows "Access Denied" for insufficient role
- Frontend checks are **UX-only** — backend is the source of truth for authorization

## Security Considerations

1. **Cookie-based auth** — httpOnly cookies managed by backend; no tokens stored in `localStorage` or `sessionStorage`
2. **Token refresh queue** — Axios interceptor queues concurrent 401 requests during refresh to avoid race conditions; redirects to `/login` on refresh failure
3. **Error sanitization** — API errors are transformed to a consistent `ApiErrorResponse` shape; raw server internals are not exposed to the UI
4. **Environment validation** — Zod validates all `NEXT_PUBLIC_*` variables at build/runtime; secrets are never exposed to the client bundle
5. **Content safety** — `sanitize()` utility strips HTML tags from user-generated strings before rendering
6. **Security headers** — `next.config.ts` sets `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`
7. **No persistent sensitive state** — Zustand auth store is in-memory only; it mirrors `/auth/me` for UI display, not as a security boundary
