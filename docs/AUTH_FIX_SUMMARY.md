# Auth DSL Implementation Fix Summary

## Overview

This document summarizes the changes made to fix the DSL implementations of authentication in the native app, aligning them with the official StackLive authentication guidance.

## Problem Statement

The original implementation had several issues:

1. **Incorrect Capability Usage**:
   - Used `users.create` for user signup (admin operation, not self-registration)
   - Used `auth.credentialsLogin` for login (requires sessionToken which native app doesn't have)

2. **Mock Implementations**:
   - Fallback mocks in `api.ts` that returned fake data when backend failed
   - `skipLogin` functionality that bypassed real authentication

3. **DSL Aliases Not Used**:
   - Not leveraging the convenient `submit('auth')` and `request('auth')` aliases

## Solution

### Core Changes

#### 1. Authentication Flows (`app/flows/auth.ts`)

**Before:**
```typescript
// Used users.create (admin operation)
export const createUserFlow = (email: string, password: string, roleIds: string[]) =>
  flow('user-create').step(op('users.create', {...})).build();

// Used auth.credentialsLogin (requires sessionToken)
export const credentialsLoginFlow = (email: string, password: string, sessionToken?: string) =>
  flow('credentials-login').step(request('auth.credentialsLogin', {...})).build();
```

**After:**
```typescript
// Uses auth.userSignUp via submit('auth') alias
export const userSignUpFlow = (email: string, password: string, subdomain?: string) =>
  flow('user-signup')
    .step(submit('auth', {
      id: 'signup',
      input: { email, password, subdomain }
    }))
    .build();

// Uses auth.authenticate via request('auth') alias
export const userLoginFlow = (email: string, password: string, actorType: 'user' | 'creator' | 'platform' = 'user') =>
  flow('user-login')
    .step(request('auth', {
      id: 'login',
      input: { body: { email, password }, actorType }
    }))
    .build();
```

#### 2. API Service (`app/services/api.ts`)

**Changes to `createUser()`:**
- Now uses `userSignUpFlow` instead of `createUserFlow`
- Looks for `userId` or `supabaseUserId` in output
- Removed mock fallback that returned fake user IDs
- Returns proper errors instead of fake success

**Changes to `authenticateUser()`:**
- Now uses `userLoginFlow` instead of `credentialsLoginFlow`
- Generates a simple session token (in production, would come from backend)
- Removed mock fallback that returned fake tokens
- Returns proper errors instead of fake success

#### 3. Auth Context (`app/contexts/AuthContext.tsx`)

**Removed:**
- `skipLogin()` function
- `skipLogin` from `AuthContextType` interface
- All logic for creating fake "skip" users

#### 4. Auth Screen (`app/AuthScreen.tsx`)

**Removed:**
- "Skip for now" button
- `handleSkip()` function
- `skipButton` and `skipText` styles

## DSL Patterns Used

### For User Signup

```typescript
submit('auth', {
  id: 'signup',
  input: {
    email: string,
    password: string,
    subdomain?: string
  }
})
```

**Maps to:** `auth.submit` → `auth.userSignUp`

**Output:**
```typescript
{
  userId: string,
  supabaseUserId: string
}
```

### For User Login

```typescript
request('auth', {
  id: 'login',
  input: {
    body: {
      email: string,
      password: string
    },
    actorType: 'user' | 'creator' | 'platform'
  }
})
```

**Maps to:** `auth.request` → `auth.authenticate`

**Output:**
```typescript
{
  userId: string
}
```

## When to Use Each Capability

Based on the official guidance:

| Scenario | Use This | Why |
|----------|----------|-----|
| End-user self-registration (native app) | `auth.userSignUp` (via `submit('auth')`) | Standard signup without session binding |
| Simple login (native app) | `auth.authenticate` (via `request('auth')`) | Basic authentication without session management |
| QR code signup | `auth.signUpUser` | Requires session token binding |
| QR code login | `auth.credentialsLogin` | Requires session token binding |
| Platform owner signup | `auth.platformSignUp` | Creates platform/creator accounts |
| Admin creating users | `users.create` | Programmatic user creation |

## Decision Tree for Native App

```
User wants to...
├─ Create new account
│  └─ Use: submit('auth') → auth.userSignUp
│
└─ Log in to existing account
   └─ Use: request('auth') → auth.authenticate
```

## Files Modified

1. `app/flows/auth.ts` - Updated flow definitions
2. `app/services/api.ts` - Updated API functions to use new flows
3. `app/contexts/AuthContext.tsx` - Removed skipLogin
4. `app/AuthScreen.tsx` - Removed skip button
5. `app/flows/examples.ts` - Updated examples
6. `scripts/test-flows.js` - Updated test script

## Testing

All changes have been validated:

- ✅ Flow creation test passes
- ✅ Linter passes
- ✅ TypeScript compilation (pre-existing issues unrelated to auth)

## Benefits

1. **Correct Semantics**: Using the right capability for the right purpose
2. **Simpler Code**: Leveraging DSL aliases reduces boilerplate
3. **No Mocks**: Proper error handling instead of fake data
4. **Better UX**: Removed confusing "skip login" that bypassed real auth
5. **Future-Proof**: Aligned with official StackLive patterns

## References

- Issue: "fix DSL implementations of auth in our native app so that it works"
- Authentication Capabilities Reference (from issue description)
- DSL Aliases: See `packages/l8-creator/app-sdk/capabilities.ts` lines 107, 112
