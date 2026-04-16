# React Native Setup for StackLive DSL

## Purpose

This is a **REFERENCE IMPLEMENTATION** showing how to properly use the StackLive DSL in a React Native environment. The DSL provides type safety, composition, and a clean abstraction layer.

## The Challenge

The `@stacklive/sdk` uses `node-forge` for cryptography, which requires Node.js APIs not available in React Native by default.

## The Solution

Use React Native polyfills to provide the necessary Node.js APIs. This allows the DSL to work seamlessly in React Native while maintaining all its benefits.

## Setup

### 1. Install Required Dependencies

```bash
npm install react-native-get-random-values process
```

### 2. Create Polyfills File (`app/polyfills.ts`)

```typescript
import 'react-native-get-random-values';

if (typeof global.process === 'undefined') {
  global.process = require('process');
}

if (global.process && global.process.env) {
  global.process.env.SDK_MODE = 'true';
  global.process.env.NODE_ENV = __DEV__ ? 'development' : 'production';
}
```

### 3. Import Polyfills FIRST in App Entry Point

In `app/_layout.tsx`:

```typescript
// Import polyfills FIRST - before any other imports
import './polyfills';

// Then import everything else
import { Stack } from 'expo-router';
// ... rest of imports
```

## Using the DSL

Now you can use the DSL as intended:

### User Signup Example

```typescript
import { runFlow } from '@stacklive/sdk';
import { userSignUpFlow } from '../flows/auth';

export async function createUser(email: string, password: string) {
  // Build the DSL flow
  const flowAST = userSignUpFlow(email, password);
  
  // Execute the flow
  const result = await runFlow(flowAST);
  
  if (result.execution.status === 'success') {
    const userId = result.execution.results['signup']?.output?.userId;
    return { success: true, userId };
  }
  
  return { success: false, error: 'Signup failed' };
}
```

### User Login Example

```typescript
import { runFlow } from '@stacklive/sdk';
import { userLoginFlow } from '../flows/auth';

export async function authenticateUser(email: string, password: string) {
  // Build the DSL flow
  const flowAST = userLoginFlow(email, password);
  
  // Execute the flow
  const result = await runFlow(flowAST);
  
  if (result.execution.status === 'success') {
    const userId = result.execution.results['login']?.output?.userId;
    return { success: true, userId };
  }
  
  return { success: false, error: 'Login failed' };
}
```

## DSL Flow Definitions

Flows are defined using the DSL builder pattern:

```typescript
import { flow, submit, request } from '@stacklive/sdk';

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

## Benefits of Using the DSL

✅ **Type Safety**: Input/output contracts are type-checked  
✅ **Composition**: Chain multiple capabilities together  
✅ **Testability**: Mock and simulate flows in tests  
✅ **Abstraction**: Hide backend implementation details  
✅ **Documentation**: Flows are self-documenting  
✅ **Consistency**: Same patterns across platforms  

## Why Not Plain HTTP Calls?

Plain HTTP calls would bypass all DSL benefits:

❌ No type safety  
❌ No composition  
❌ No testability  
❌ Tight coupling to backend  
❌ Not a reference implementation  

## Configuration

### Environment Variables (Optional)

Create `.env` file:

```bash
# For development with real backend
EXPO_PUBLIC_API_URL=https://api.stacklive.app

# For local development
EXPO_PUBLIC_API_URL=http://localhost:3000
```

The SDK will use these for capability execution when connected to a real backend.

## Testing

```bash
# Start the app
npm start

# Test authentication flows
# - Sign up a new user
# - Log in with credentials
# - View mini apps list

# All operations use the DSL via runFlow()
```

## Troubleshooting

### "Cannot find module 'crypto'"
- ✅ Make sure `import './polyfills'` is the FIRST import in `_layout.tsx`
- ✅ Verify `react-native-get-random-values` is installed

### "process is not defined"
- ✅ Make sure `process` package is installed
- ✅ Check polyfills.ts is setting up global.process

### "node-forge" errors
- ✅ Polyfills must be imported before SDK
- ✅ Clear Metro bundler cache: `npx expo start -c`

## Summary

This app demonstrates the **correct way** to use the StackLive DSL in React Native:

1. ✅ Install polyfill dependencies
2. ✅ Import polyfills first in app entry
3. ✅ Define flows using DSL builders
4. ✅ Execute flows with `runFlow()`
5. ✅ Handle results with type safety

This is the reference implementation other developers should follow.

