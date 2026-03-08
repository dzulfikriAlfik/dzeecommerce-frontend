# Dzeecommerce Frontend

Production-grade e-commerce frontend built with Next.js, React, strict TypeScript, and TailwindCSS.

## Summary
This repository contains the customer-facing storefront and internal admin frontend for Dzeecommerce. It is designed for responsive mobile-first UX, clear module boundaries, secure session handling, and maintainable frontend architecture.

## Core responsibilities
- storefront pages and product browsing
- customer authentication flows
- cart and checkout UI
- order history and payment status pages
- realtime notifications and invoice payment updates
- admin dashboards for approved internal roles
- API integration using Axios and TanStack Query
- lightweight client state with Zustand
- Docker and PM2 deployment support
- frontend testing with minimum 80% coverage target

## Architecture principles
- strict TypeScript everywhere
- Next.js app-based structure
- mobile-first responsive design
- feature-oriented module organization
- reusable UI components
- server state handled with TanStack Query
- client-only transient state handled with Zustand
- security-conscious rendering and error handling

## Planned main modules
- foundation and providers
- authentication
- catalog
- cart
- checkout
- orders
- payments and realtime
- notifications
- admin area
- testing and deployment

## Standard roles
- `guest`
- `customer`
- `customer_support`
- `warehouse`
- `finance`
- `admin`
- `super_admin`

All feature documentation must explicitly describe:
- roles involved
- what each role can do
- what each role cannot do
- UI visibility rules
- backend authorization dependency
- security considerations

## Documentation index
- [Development task plan](docs/plans/development-task-plan.md)
- [Milestones](docs/plans/milestones.md)
- [Feature template](docs/feature-template.md)

## Environment strategy
Separate env files are required:
- `.env.development`
- `.env.production`
- `.env.test`

Only public-safe variables may be exposed to the client.

## Quality gates
Every task must include:
- lint
- typecheck
- tests
- build validation
- security review
- documentation update

## Quick Start

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Run validation suite
npm run validate   # lint + typecheck + test + build
```

## Scripts

| Script           | Description                              |
| ---------------- | ---------------------------------------- |
| `npm run dev`    | Start development server                 |
| `npm run build`  | Production build                         |
| `npm run lint`   | ESLint check                             |
| `npm run typecheck` | TypeScript strict type check          |
| `npm run test`   | Run test suite                           |
| `npm run test:watch` | Tests in watch mode                  |
| `npm run test:coverage` | Tests with v8 coverage            |
| `npm run validate` | Full CI validation pipeline            |

## Current Status

**Foundation complete (Tasks F1 + F2)**
- All config files, core libraries, and design system implemented
- 11 tests passing, zero lint/type errors, production build validated
- See [Frontend Foundation docs](docs/features/frontend-foundation.md) for full details
