# StackLive Auth DSL - Quick Reference Guide

## 🎯 For Native App Developers

This guide shows you exactly which auth capabilities to use in your native app.

---

## 📱 Native App Use Cases

### ✅ User Signs Up (Self-Registration)

**Use:** `submit('auth')` alias

```typescript
import { userSignUpFlow } from './flows/auth';
import { runFlow } from '@stacklive/sdk';

async function signup(email: string, password: string) {
  const flowAST = userSignUpFlow(email, password);
  const result = await runFlow(flowAST);
  
  if (result.execution.status === 'success') {
    const userId = result.execution.results['signup']?.output?.userId;
    return { success: true, userId };
  }
  
  return { success: false, error: 'Signup failed' };
}
```

**What it does:**
- Creates a new user account
- Suitable for end-user self-registration
- No session token required
- Returns both `userId` and `supabaseUserId`

---

### ✅ User Logs In

**Use:** `request('auth')` alias

```typescript
import { userLoginFlow } from './flows/auth';
import { runFlow } from '@stacklive/sdk';

async function login(email: string, password: string) {
  const flowAST = userLoginFlow(email, password);
  const result = await runFlow(flowAST);
  
  if (result.execution.status === 'success') {
    const userId = result.execution.results['login']?.output?.userId;
    return { success: true, userId };
  }
  
  return { success: false, error: 'Login failed' };
}
```

**What it does:**
- Authenticates existing user
- Simple email/password auth
- No session token required
- Returns `userId`

---

## 🚫 What NOT to Use in Native Apps

### ❌ DON'T Use `users.create`
```typescript
// ❌ WRONG - This is for admin operations
op('users.create', { ... })
```
**Why not:** This is for admins programmatically creating users, not self-registration.

### ❌ DON'T Use `auth.credentialsLogin`
```typescript
// ❌ WRONG - This requires a session token
request('auth.credentialsLogin', { 
  input: { email, password, sessionToken } 
})
```
**Why not:** Requires session token, which is for QR code / cross-device auth.

### ❌ DON'T Use `auth.signUpUser`
```typescript
// ❌ WRONG - This requires a session token
request('auth.signUpUser', { 
  input: { email, password, sessionToken } 
})
```
**Why not:** Requires session token for session binding (QR code flows).

---

## 🎨 Complete Implementation Example

### 1. Flow Definitions (`flows/auth.ts`)

```typescript
import { flow, request, submit } from '@stacklive/sdk';

// Signup flow
export const userSignUpFlow = (email: string, password: string) =>
  flow('user-signup')
    .step(submit('auth', {
      id: 'signup',
      input: { email, password }
    }))
    .build();

// Login flow
export const userLoginFlow = (email: string, password: string) =>
  flow('user-login')
    .step(request('auth', {
      id: 'login',
      input: {
        body: { email, password },
        actorType: 'user'
      }
    }))
    .build();
```

### 2. API Service (`services/api.ts`)

```typescript
import { runFlow } from '@stacklive/sdk';
import { userSignUpFlow, userLoginFlow } from '../flows/auth';

export async function createUser(email: string, password: string) {
  try {
    const flowAST = userSignUpFlow(email, password);
    const result = await runFlow(flowAST);
    
    if (result.execution.status === 'success') {
      const userId = result.execution.results['signup']?.output?.userId;
      return { success: true, userId };
    }
    
    const error = Object.values(result.execution.results)
      .find(step => step.status === 'error')?.error;
    return { success: false, error };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Signup failed' 
    };
  }
}

export async function authenticateUser(email: string, password: string) {
  try {
    const flowAST = userLoginFlow(email, password);
    const result = await runFlow(flowAST);
    
    if (result.execution.status === 'success') {
      const userId = result.execution.results['login']?.output?.userId;
      const token = `token-${userId}-${Date.now()}`;
      return { success: true, userId, token };
    }
    
    const error = Object.values(result.execution.results)
      .find(step => step.status === 'error')?.error;
    return { success: false, error };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Login failed' 
    };
  }
}
```

### 3. React Component Usage

```typescript
import { useState } from 'react';
import { createUser, authenticateUser } from './services/api';

function AuthScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSubmit = async () => {
    const result = isSignUp
      ? await createUser(email, password)
      : await authenticateUser(email, password);

    if (result.success) {
      // Navigate to home screen
      console.log('Success!', result.userId);
    } else {
      // Show error
      console.error('Error:', result.error);
    }
  };

  return (
    <div>
      <input value={email} onChange={e => setEmail(e.target.value)} />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
      <button onClick={handleSubmit}>
        {isSignUp ? 'Sign Up' : 'Log In'}
      </button>
      <button onClick={() => setIsSignUp(!isSignUp)}>
        Switch to {isSignUp ? 'Login' : 'Signup'}
      </button>
    </div>
  );
}
```

---

## 🔍 Decision Tree

```
┌─────────────────────────────────────────┐
│  User wants to authenticate...          │
└─────────────────────────────────────────┘
                  │
        ┌─────────┴─────────┐
        │                   │
   Creating new       Logging into
   account?          existing account?
        │                   │
        ▼                   ▼
   submit('auth')     request('auth')
        │                   │
        ▼                   ▼
  auth.userSignUp    auth.authenticate
        │                   │
        ▼                   ▼
   { userId,          { userId }
     supabaseUserId }
```

---

## 📊 Capability Comparison Table

| Capability | Native App? | Session Token? | Use Case |
|------------|-------------|----------------|----------|
| `submit('auth')` → `auth.userSignUp` | ✅ YES | ❌ No | Standard user signup |
| `request('auth')` → `auth.authenticate` | ✅ YES | ❌ No | Standard user login |
| `auth.signUpUser` | ❌ No | ✅ Yes | QR code signup |
| `auth.credentialsLogin` | ❌ No | ✅ Yes | QR code login |
| `auth.platformSignUp` | ⚠️ Maybe | ❌ No | Platform owner signup |
| `users.create` | ❌ No | ❌ No | Admin operation |

---

## ✨ Key Takeaways

1. **For native app signup**: Use `submit('auth')` → `auth.userSignUp`
2. **For native app login**: Use `request('auth')` → `auth.authenticate`
3. **No session token needed** for native apps
4. **Session-bound auth** (credentialsLogin, signUpUser) is for QR code flows
5. **Admin operations** (users.create) are for programmatic user creation

---

## 🐛 Troubleshooting

### "Authentication requires session token"
- ❌ You're using `auth.credentialsLogin` 
- ✅ Switch to `request('auth')` / `auth.authenticate`

### "User creation requires roleIds"
- ❌ You're using `users.create`
- ✅ Switch to `submit('auth')` / `auth.userSignUp`

### "Cannot find submit/request function"
- ❌ Not imported from SDK
- ✅ Import: `import { submit, request } from '@stacklive/sdk';`

---

## 📚 Additional Resources

- **Official Guidance**: See issue description for full auth capabilities reference
- **DSL Aliases**: Defined in `packages/l8-creator/app-sdk/capabilities.ts`
- **Implementation**: See `app/flows/auth.ts` for working examples
- **Visual Guide**: See `VISUAL_COMPARISON.md` for before/after examples

---

## 🎓 Quick Copy-Paste

### Signup
```typescript
const flowAST = flow('user-signup')
  .step(submit('auth', {
    id: 'signup',
    input: { email, password }
  }))
  .build();
```

### Login
```typescript
const flowAST = flow('user-login')
  .step(request('auth', {
    id: 'login',
    input: {
      body: { email, password },
      actorType: 'user'
    }
  }))
  .build();
```

---

**Last Updated:** 2026-04-16  
**Status:** ✅ Production Ready
