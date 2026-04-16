# DSL Flow Implementation

This document describes the DSL flow implementations for user authentication and account management using @stacklive/sdk.

## Overview

The application now uses StackLive's DSL (Domain Specific Language) to define authentication flows in a declarative manner. These flows are defined in `/app/flows/auth.ts` and integrated into the API service.

## Flow Definitions

### 1. Create User Flow (`createUserFlow`)

Creates a new user account using the `users.create` capability.

```typescript
const flowAST = createUserFlow('user@example.com', 'password123');
```

**Capability**: `users.create`  
**Endpoint**: POST `/api/users/create`

**Input**:
- `email`: string
- `password`: string
- `roleIds`: string[] (default: `['role_user']`)

**Output**:
- `userId`: string
- `success`: boolean

### 2. Sign Up User Flow (`signUpUserFlow`)

Creates a new user with session binding using the `auth.signUpUser` capability.

```typescript
const flowAST = signUpUserFlow(
  'newuser@example.com',
  'Str0ng!Pass#',
  'session-token-xyz',
  'myapp'
);
```

**Capability**: `auth.signUpUser`

**Input**:
- `email`: string
- `password`: string
- `sessionToken`: string (optional)
- `subdomain`: string (optional)

**Output**:
- `userId`: string
- `successUrl`: string
- Session binding information

**When to Use**: When implementing user registration with session management.

### 3. Credentials Login Flow (`credentialsLoginFlow`)

Authenticates users with email and password using session-bound authentication.

```typescript
const flowAST = credentialsLoginFlow(
  'user@example.com',
  'Str0ng!Pass#',
  'session-token-xyz'
);
```

**Capability**: `auth.credentialsLogin`

**Input**:
- `email`: string
- `password`: string
- `sessionToken`: string (optional)

**Output**:
- `userId`: string
- `successUrl`: string (typically `/dashboard`)

**When to Use**: When implementing session-bound authentication for web/mobile apps.

### 4. Authenticate User Flow (`authenticateUserFlow`)

General authentication for platform owners, creators, or end users.

```typescript
const flowAST = authenticateUserFlow(
  'user@example.com',
  'Str0ng!Pass#',
  'user' // or 'platform', 'creator'
);
```

**Capability**: `auth.authenticate`

**Input**:
- `body.email`: string
- `body.password`: string
- `actorType`: 'user' | 'platform' | 'creator' (default: 'user')

**Output**:
- `userId`: string
- Authentication token

**When to Use**: When implementing login flows for platform owners, creators, or end users.

## Integration

### API Service Integration

The flows are integrated in `/app/services/api.ts`:

```typescript
import { runFlow } from '@stacklive/sdk';
import { createUserFlow, credentialsLoginFlow } from '../flows/auth';

export async function createUser(email: string, password: string) {
  const flowAST = createUserFlow(email, password);
  const result = await runFlow(flowAST);
  
  if (result.execution.status === 'success') {
    const userId = result.execution.results['create-user']?.output?.userId;
    return { success: true, userId };
  }
  return { success: false, error: 'User creation failed' };
}
```

### Flow Execution

Flows are executed using the `runFlow()` function from @stacklive/sdk:

```typescript
import { runFlow } from '@stacklive/sdk';

const result = await runFlow(flowAST);
console.log('Status:', result.execution.status);
console.log('Results:', result.execution.results);
```

The result contains:
- `execution`: Execution details and status
  - `status`: 'success' | 'error'
  - `results`: Object with step results keyed by step ID
  - `error`: Error message if status is 'error'
- `ui`: UI artifacts and metadata

## DSL Patterns

### Using `op()` for Direct Capability Invocation

The `op()` helper directly invokes a capability:

```typescript
op('users.create', {
  id: 'create-user',
  input: { email, password, roleIds }
})
```

### Using `request()` for Resource Requests

The `request()` helper creates a request intent for a resource:

```typescript
request('auth.signUpUser', {
  id: 'register',
  input: { email, password, sessionToken }
})
```

### Flow Builder Pattern

All flows follow this pattern:

```typescript
flow('flow-id')          // Create flow with unique ID
  .step(intentNode)      // Add steps sequentially
  .build()               // Build immutable FlowAST
```

## Development Notes

### Fallback Behavior

The implementation includes fallback to mock data when the backend is unavailable:

```typescript
try {
  const result = await runFlow(flowAST);
  // Process result...
} catch (error) {
  // Fallback to mock for development
  return { success: true, userId: `mock-user-${Date.now()}` };
}
```

### Error Handling

Flow execution errors are caught and logged:

```typescript
if (result.execution.status === 'success') {
  // Extract output from step results
} else {
  return { success: false, error: result.execution.error };
}
```

## References

- [StackLive SDK Documentation](https://www.stacklive.dev/sample/dsl)
- [@stacklive/sdk on npm](https://www.npmjs.com/package/@stacklive/sdk)
- Issue: "implement create user account using DSL @stacklive/sdk"
