# Dzeecommerce Frontend Development Task Plan

## Scope
This document defines the incremental frontend development plan for the production-grade e-commerce platform.

## Global rules for every task
Each task must be:
- incremental
- small and safe
- testable
- non-breaking to previous code

Each task must include:
- lint
- typecheck
- tests
- build validation
- security review
- feature documentation update
- role documentation:
  - roles involved
  - what each role can do
  - what each role cannot do

## Roles to document in feature documentation
- guest
- customer
- customer_support
- warehouse
- finance
- admin
- super_admin

# Phase 1 — Frontend foundation

## Task F1 — Next.js project scaffold
### Goal
Initialize the Next.js frontend with strict TypeScript and TailwindCSS.
### Files to create
- `package.json`
- `tsconfig.json`
- `next.config.ts`
- `src/app/layout.tsx`
- `src/app/page.tsx`
- `src/app/providers.tsx`
- `src/styles/globals.css`
- `src/lib/env.ts`
- `tailwind.config.ts`
- `postcss.config.js`
- `.env.development`
- `.env.production`
- `.env.test`
- `README.md`
### Expected output
- frontend boots successfully
- Tailwind works
- strict TypeScript enabled
- base app providers ready
### Tests to implement
- home page render test
- env parsing unit test
### Code quality checks
- lint
- typecheck
- tests
- build
### Security considerations
- never expose backend secrets in client env
- validate public env values
- no token storage in localStorage by default

## Task F2 — Shared frontend architecture baseline
### Goal
Set up shared libraries for API, query management, state, and utilities.
### Files to create
- `src/app/query-client.ts`
- `src/lib/axios.ts`
- `src/lib/constants.ts`
- `src/lib/utils.ts`
- `src/stores/auth.store.ts`
- `src/hooks/use-auth.ts`
- `src/services/api/auth.api.ts`
- `docs/features/frontend-foundation.md`
### Expected output
- Axios client configured
- TanStack Query provider configured
- Zustand auth state baseline created
### Tests to implement
- Axios interceptor unit test
- auth store unit test
### Code quality checks
- lint
- typecheck
- tests
- build
### Security considerations
- support cookie-based auth flow
- avoid persistent storage for sensitive tokens
- sanitize API error messages in UI

# Phase 2 — Authentication

## Task F3 — Authentication pages
### Goal
Implement login and registration pages with mobile-first UI.
### Files to create
- `src/app/login/page.tsx`
- `src/app/register/page.tsx`
- `src/modules/auth/components/login-form.tsx`
- `src/modules/auth/components/register-form.tsx`
- `src/modules/auth/schemas/auth.schema.ts`
- `docs/features/frontend-authentication.md`
### Expected output
- login and register pages work
- form validation is clear
- loading and error states are handled
### Tests to implement
- login form validation test
- register form validation test
- success and failure UI tests
### Code quality checks
- lint
- typecheck
- tests
- build
### Security considerations
- avoid unsafe error disclosure
- CSRF approach must align with backend cookie strategy
- prevent unsafe rendering of server messages

## Task F4 — Session-aware route protection
### Goal
Protect authenticated pages and define role-based UI visibility.
### Files to create
- `src/middleware.ts`
- `src/modules/auth/guards/`
- `src/components/layout/protected-layout.tsx`
- `docs/features/frontend-authorization.md`
### Expected output
- authenticated pages protected
- admin area hidden from unauthorized users
- role-aware navigation baseline exists
### Tests to implement
- protected route test
- unauthorized redirect test
- role-based menu visibility test
### Code quality checks
- lint
- typecheck
- tests
- build
### Security considerations
- frontend checks are UX-only
- backend remains source of truth for authorization
- avoid exposing privileged UI data unnecessarily

# Phase 3 — Catalog

## Task F5 — Catalog service layer
### Goal
Create API hooks and service methods for product catalog.
### Files to create
- `src/services/api/catalog.api.ts`
- `src/modules/catalog/hooks/`
- `src/modules/catalog/types/`
- `docs/features/frontend-catalog-services.md`
### Expected output
- product list and detail query hooks work
- type-safe catalog data fetching ready
### Tests to implement
- catalog API service unit test
- query hook state test
### Code quality checks
- lint
- typecheck
- tests
- build
### Security considerations
- treat all server content as untrusted
- avoid blind HTML rendering
- handle API failures safely

## Task F6 — Product listing page
### Goal
Build mobile-first product listing page.
### Files to create
- `src/app/products/page.tsx`
- `src/modules/catalog/components/product-grid.tsx`
- `src/modules/catalog/components/product-card.tsx`
- `docs/features/frontend-product-list.md`
### Expected output
- user can browse product listings
- loading, empty, and error states exist
- responsive layout works on mobile first
### Tests to implement
- product list render test
- loading state test
- empty state test
- error state test
### Code quality checks
- lint
- typecheck
- tests
- build
### Security considerations
- escape rendered content
- no client-side trust in final pricing logic

## Task F7 — Product detail page
### Goal
Build product detail page with variant display and add-to-cart trigger.
### Files to create
- `src/app/products/[slug]/page.tsx`
- `src/modules/catalog/components/product-detail.tsx`
- `docs/features/frontend-product-detail.md`
### Expected output
- user can view product details
- variant and price information displayed correctly
### Tests to implement
- product detail render test
- unavailable product state test
### Code quality checks
- lint
- typecheck
- tests
- build
### Security considerations
- product availability is informational only
- backend validates final purchasable state

# Phase 4 — Cart and checkout

## Task F8 — Cart service layer and state
### Goal
Implement cart API integration and local UI state helpers.
### Files to create
- `src/services/api/cart.api.ts`
- `src/modules/cart/hooks/`
- `src/modules/cart/store/`
- `docs/features/frontend-cart-services.md`
### Expected output
- cart queries and mutations work
- client updates reflect backend responses
### Tests to implement
- cart service unit test
- cart state update test
### Code quality checks
- lint
- typecheck
- tests
- build
### Security considerations
- do not trust client-side totals
- auth/session expiration handled safely

## Task F9 — Cart page
### Goal
Build mobile-first cart page.
### Files to create
- `src/app/cart/page.tsx`
- `src/modules/cart/components/cart-list.tsx`
- `src/modules/cart/components/cart-summary.tsx`
- `docs/features/frontend-cart.md`
### Expected output
- user can review cart
- quantity changes and remove actions work
### Tests to implement
- cart render test
- quantity update UI test
- remove item UI test
### Code quality checks
- lint
- typecheck
- tests
- build
### Security considerations
- totals shown as informational until backend confirms
- safe handling of unavailable items

## Task F10 — Checkout page
### Goal
Build checkout page and order creation flow.
### Files to create
- `src/app/checkout/page.tsx`
- `src/modules/checkout/components/checkout-form.tsx`
- `src/modules/checkout/schemas/checkout.schema.ts`
- `src/services/api/checkout.api.ts`
- `docs/features/frontend-checkout.md`
### Expected output
- user can submit checkout
- order creation flow works against backend
- validation and error states are complete
### Tests to implement
- checkout form validation test
- successful submission test
- submission error state test
### Code quality checks
- lint
- typecheck
- tests
- build
### Security considerations
- do not trust client-side computed totals
- sanitize backend validation messages before UI rendering

## Task F11 — Order detail page
### Goal
Display order summary and payment status.
### Files to create
- `src/app/orders/[id]/page.tsx`
- `src/modules/orders/components/order-summary.tsx`
- `src/services/api/orders.api.ts`
- `docs/features/frontend-orders.md`
### Expected output
- user can view own order details
- order status and payment state displayed clearly
### Tests to implement
- order summary render test
- unauthorized state test
- loading/error state test
### Code quality checks
- lint
- typecheck
- tests
- build
### Security considerations
- do not display data for unauthorized users
- backend remains source of truth for order ownership

# Phase 5 — Payments and realtime

## Task F12 — Payment UI integration
### Goal
Integrate invoice/payment initiation UX with backend responses.
### Files to create
- `src/modules/payments/`
- `src/services/api/payments.api.ts`
- `docs/features/frontend-payments.md`
### Expected output
- user can continue payment flow from order context
- invoice/payment information is shown clearly
### Tests to implement
- payment initiation UI test
- payment error handling test
### Code quality checks
- lint
- typecheck
- tests
- build
### Security considerations
- never treat client action as proof of payment
- payment success comes from backend state only

## Task F13 — WebSocket client for realtime updates
### Goal
Add realtime payment and notification subscriptions.
### Files to create
- `src/lib/websocket.ts`
- `src/services/websocket/notification.socket.ts`
- `src/modules/notifications/hooks/`
- `docs/features/frontend-websocket.md`
### Expected output
- websocket connection established after auth
- realtime payment and notification events received
### Tests to implement
- websocket client unit test
- reconnect behavior test
- event dispatch test
### Code quality checks
- lint
- typecheck
- tests
- build
### Security considerations
- handle auth expiration
- do not subscribe to unauthorized channels
- do not trust socket payload shape without validation

## Task F14 — In-app notification UI and popup system
### Goal
Build notification center and popup interaction using a modern popup library.
### Files to create
- `src/modules/notifications/components/notification-center.tsx`
- `src/components/ui/dialog/`
- `docs/features/frontend-notifications.md`
### Expected output
- realtime notifications visible
- popup interactions are consistent and accessible
### Tests to implement
- notification center render test
- popup open/close test
- unsafe content handling test
### Code quality checks
- lint
- typecheck
- tests
- build
### Security considerations
- sanitize displayed message content
- do not expose internal-only notification data

# Phase 6 — Admin frontend

## Task F15 — Admin area foundation
### Goal
Create protected admin layout and role-based navigation.
### Files to create
- `src/app/admin/layout.tsx`
- `src/app/admin/page.tsx`
- `src/modules/admin/components/admin-sidebar.tsx`
- `docs/features/frontend-admin-foundation.md`
### Expected output
- protected admin area available
- role-aware menu visibility supported
### Tests to implement
- admin route guard test
- role-based menu test
### Code quality checks
- lint
- typecheck
- tests
- build
### Security considerations
- UI restrictions are not security controls
- privileged data fetched only after backend authorization

## Task F16 — Admin catalog management UI
### Goal
Build admin catalog screens for product operations.
### Files to create
- `src/app/admin/products/page.tsx`
- `src/modules/admin/catalog/`
- `docs/features/frontend-admin-catalog.md`
### Expected output
- admin can view and manage products through UI
### Tests to implement
- admin catalog page render test
- unauthorized access UI test
### Code quality checks
- lint
- typecheck
- tests
- build
### Security considerations
- admin-only routes protected
- form input validated client-side and server-side

## Task F17 — Admin order and payment monitoring UI
### Goal
Build admin operational pages for order and payment monitoring.
### Files to create
- `src/app/admin/orders/page.tsx`
- `src/app/admin/payments/page.tsx`
- `src/modules/admin/orders/`
- `src/modules/admin/payments/`
- `docs/features/frontend-admin-operations.md`
### Expected output
- support, warehouse, finance, and admin users have appropriate UI views by role
### Tests to implement
- role visibility tests
- list rendering tests
- unauthorized module hiding tests
### Code quality checks
- lint
- typecheck
- tests
- build
### Security considerations
- minimize sensitive data exposure
- backend must filter data by permission scope

# Phase 7 — Testing and quality

## Task F18 — Frontend test harness and coverage
### Goal
Set up standardized frontend testing with 80% minimum coverage target.
### Files to create
- `vitest.config.ts`
- `tests/setup.ts`
- `tests/helpers/`
- `docs/testing/strategy.md`
### Expected output
- unit/integration test environment stable
- coverage threshold set to minimum 80%
### Tests to implement
- regression tests for:
  - auth pages
  - route guards
  - cart
  - checkout
  - order detail
  - realtime notification rendering
### Code quality checks
- lint
- typecheck
- tests
- coverage
- build
### Security considerations
- regression tests for unauthorized UI exposure
- regression tests for unsafe content rendering

# Phase 8 — Docker and deployment

## Task F19 — Docker setup
### Goal
Prepare frontend Docker configuration.
### Files to create
- `docker/Dockerfile`
- `docker/Dockerfile.dev`
- `.dockerignore`
### Expected output
- frontend builds in Docker
- development container available
### Tests to implement
- container build smoke test
- app startup smoke test
### Code quality checks
- Docker build
- app build
- tests
### Security considerations
- no secrets baked into image
- minimal runtime image
- non-root user where possible

## Task F20 — PM2 and VPS deployment docs
### Goal
Prepare PM2 config and VPS deployment documentation for frontend.
### Files to create
- `ecosystem.config.cjs`
- `docs/deployment/pm2.md`
- `docs/deployment/vps-deployment.md`
### Expected output
- PM2 run configuration exists
- VPS deployment steps documented
- release and rollback guidance documented
### Tests to implement
- manual deployment checklist
- startup script validation checklist
### Code quality checks
- build validation
- script validation
- doc review
### Security considerations
- frontend served behind HTTPS
- only public env variables exposed
- reverse proxy guidance included

# Backend dependency notes
The frontend plan depends on these backend capabilities becoming available:
- `/api/v1/auth`
- `/api/v1/products`
- `/api/v1/cart`
- `/api/v1/checkout`
- `/api/v1/orders`
- `/api/v1/payments`
- websocket auth and notification events

Frontend tasks should be implemented only after the required backend contract is stable.

# Definition of done
A frontend task is complete only if:
- implementation works
- existing behavior is not broken
- tests pass
- coverage is preserved or improved
- lint passes
- typecheck passes
- build passes
- docs are updated
- roles are documented for the feature
- security review is completed
