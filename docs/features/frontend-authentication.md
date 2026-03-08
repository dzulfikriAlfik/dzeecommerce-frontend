# Feature: Authentication Pages (F3)

## Status: ✅ Completed

## Summary

Mobile-first login and registration pages with Zod form validation, loading/error states, and secure cookie-based auth via the existing `useAuth` hook and `authApi` service.

## Files Created

| File | Purpose |
| --- | --- |
| `src/modules/auth/schemas/auth.schema.ts` | Zod schemas for login and register forms |
| `src/modules/auth/components/login-form.tsx` | Login form with validation, loading, error handling |
| `src/modules/auth/components/register-form.tsx` | Register form with validation, loading, field-level backend errors |
| `src/app/(auth)/login/page.tsx` | Login page (updated from placeholder) |
| `src/app/(auth)/register/page.tsx` | Register page (updated from placeholder) |
| `src/app/(auth)/layout.tsx` | Auth layout with glassmorphism card and background decoration |

## File Mapping to Task Plan

| Task Plan Path | Actual Path | Rationale |
| --- | --- | --- |
| `src/app/login/page.tsx` | `src/app/(auth)/login/page.tsx` | Route group `(auth)` shares layout without affecting URL |
| `src/app/register/page.tsx` | `src/app/(auth)/register/page.tsx` | Same — URLs remain `/login` and `/register` |
| `src/modules/auth/...` | `src/modules/auth/...` | Matches plan exactly |

## Validation

### Login Form
- Email: required, valid email format
- Password: required, minimum 8 characters
- Client error: Zod validation displayed per-field
- Server error: sanitized message displayed in alert banner
- Success: calls `useAuth().login()`, toast notification, redirect to `/`

### Register Form
- Name: required, 2–100 characters
- Email: required, valid email format
- Password: required, 8+ chars, must contain uppercase + lowercase + number
- Confirm Password: must match password
- Client error: Zod validation displayed per-field
- Server error: sanitized message in banner + field-level errors from backend `errors` map
- Success: calls `useAuth().register()`, toast notification, redirect to `/`

## Tests Implemented

| Test File | Tests | Coverage |
| --- | --- | --- |
| `tests/unit/modules/auth/auth.schema.test.ts` | 9 | Login/register Zod schema validation |
| `tests/unit/modules/auth/login-form.test.tsx` | 7 | Render, validation, success, failure, navigation |
| `tests/unit/modules/auth/register-form.test.tsx` | 10 | Render, validation, password rules, match, success, failure, backend field errors |

## Role Documentation

| Role | Can Do | Cannot Do |
| --- | --- | --- |
| `guest` | View login and register pages. Submit login/register forms. | Access authenticated pages after form submission fails. |
| `customer` | After successful login: redirected to home. Can re-visit login page (not blocked — UX redirect planned for F4). | N/A at this level. |
| `customer_support` | Same as customer for login flow. | N/A at this level. |
| `warehouse` | Same as customer for login flow. | N/A at this level. |
| `finance` | Same as customer for login flow. | N/A at this level. |
| `admin` | Same as customer for login flow. | N/A at this level. |
| `super_admin` | Same as customer for login flow. | N/A at this level. |

### UI Visibility Rules
- Login/register pages are public — accessible to all roles including guests
- After successful auth, user is redirected to `/` (session-aware redirect logic deferred to F4)
- No role-specific UI differences on auth pages

## Security Considerations

1. **No unsafe error disclosure** — Server error messages are passed through `sanitize()` which escapes HTML entities (`<`, `>`, `&`, `"`, `'`) before rendering, preventing XSS from malicious API responses.
2. **CSRF alignment** — Forms use `POST` via Axios with `withCredentials: true`. The backend cookie strategy (httpOnly, SameSite) handles CSRF protection. No CSRF token header is needed when using SameSite cookies.
3. **No server message rendering as HTML** — All error messages are rendered as text content, never via `dangerouslySetInnerHTML`.
4. **No client-side token storage** — Auth state comes from httpOnly cookies managed by the backend. Zustand store is in-memory display-only.
5. **Password requirements enforced client-side** — Uppercase, lowercase, number, 8+ chars. Backend validates independently.
6. **Generic fallback errors** — When the server provides no message, a generic safe string is shown instead of exposing internal details.
7. **Field-level backend errors** — Only mapped to known form fields; unknown keys are ignored to prevent UI injection.
