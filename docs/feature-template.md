# Feature Documentation Template

Use this template for every frontend feature.

---

# Feature: <Feature Name>

## 1. Purpose
Describe the business purpose and UI scope of the feature.

## 2. Status
- Planned / In Progress / Completed

## 3. Roles involved
List all roles that interact with the feature.

### Role access matrix
#### `guest`
- Can:
- Cannot:

#### `customer`
- Can:
- Cannot:

#### `customer_support`
- Can:
- Cannot:

#### `warehouse`
- Can:
- Cannot:

#### `finance`
- Can:
- Cannot:

#### `admin`
- Can:
- Cannot:

#### `super_admin`
- Can:
- Cannot:

## 4. UI scope
- Pages/routes involved:
- Components involved:
- Dialogs/popups involved:
- Mobile-first considerations:

## 5. Backend dependency
- Required API endpoints:
- Required websocket events:
- Required auth/permission behavior:

## 6. State management
- TanStack Query usage:
- Zustand usage:
- Local component state:

## 7. Validation and UX rules
- Form validation:
- Empty states:
- Loading states:
- Error states:
- Retry behavior:

## 8. Security considerations
- Authentication expectations
- Authorization expectations
- Sensitive data visibility rules
- Unsafe content handling
- Session expiry handling
- Client-side limitations

## 9. Accessibility considerations
- Keyboard interactions
- Focus management
- Semantic markup
- Screen reader expectations

## 10. Realtime behavior
If applicable:
- WebSocket subscriptions
- Event handling rules
- Reconnect behavior
- Unauthorized subscription handling

## 11. Files involved
- Pages:
- Components:
- Hooks:
- Services:
- Stores:
- Schemas:
- Tests:
- Docs:

## 12. Expected output
Describe the expected user-visible result.

## 13. Tests to implement
### Unit tests
- 

### Integration tests
- 

### UI state tests
- 

### Regression tests
- 

## 14. Code quality checks
- lint
- typecheck
- tests
- coverage
- build

## 15. Deployment notes
- env changes
- backward compatibility notes
- rollout notes

## 16. Open questions
- 
