# Feature: Frontend Foundation (F1 + F2)

## Status: ✅ Completed

## Summary

Base frontend project scaffold for Dzeecommerce — a production-grade e-commerce platform.

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
