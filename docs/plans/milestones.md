# Dzeecommerce Frontend Milestones

This document groups frontend tasks into safe delivery milestones.

## Milestone M1 — Frontend foundation
### Included tasks
- F1 — Next.js project scaffold
- F2 — Shared frontend architecture baseline

### Outcome
- Next.js foundation exists
- shared providers, API client, query client, and auth state baseline are ready

### Exit criteria
- frontend starts successfully
- Tailwind works
- Axios and TanStack Query baseline are configured

## Milestone M2 — Authentication and route control
### Included tasks
- F3 — Authentication pages
- F4 — Session-aware route protection

### Outcome
- login/register flows exist
- protected routes and role-aware UI rules are established

### Exit criteria
- auth UI tests pass
- protected route behavior works
- frontend auth docs include role visibility rules

## Milestone M3 — Catalog browsing
### Included tasks
- F5 — Catalog service layer
- F6 — Product listing page
- F7 — Product detail page

### Outcome
- users can browse and inspect products
- catalog service hooks are stable

### Exit criteria
- product list/detail UI tests pass
- loading, error, and empty states are implemented

## Milestone M4 — Cart and checkout experience
### Included tasks
- F8 — Cart service layer and state
- F9 — Cart page
- F10 — Checkout page
- F11 — Order detail page

### Outcome
- customers can manage cart, submit checkout, and view order details

### Exit criteria
- cart and checkout flows pass tests
- order pages respect ownership and session handling

## Milestone M5 — Payments and realtime UX
### Included tasks
- F12 — Payment UI integration
- F13 — WebSocket client for realtime updates
- F14 — In-app notification UI and popup system

### Outcome
- payment status can update in realtime
- notifications are visible and interactive

### Exit criteria
- websocket tests pass
- realtime status updates work in UI
- notification content is handled safely

## Milestone M6 — Admin frontend operations
### Included tasks
- F15 — Admin area foundation
- F16 — Admin catalog management UI
- F17 — Admin order and payment monitoring UI

### Outcome
- internal roles have protected admin screens with scoped visibility

### Exit criteria
- admin route guard tests pass
- role-based navigation and module visibility work correctly

## Milestone M7 — Quality and release readiness
### Included tasks
- F18 — Frontend test harness and coverage
- F19 — Docker setup
- F20 — PM2 and VPS deployment docs

### Outcome
- frontend is test-hardened and deployment-ready

### Exit criteria
- coverage threshold >= 80%
- Docker build succeeds
- deployment docs are complete and reviewed
