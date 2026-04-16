# ✅ COMPLETE: Auth DSL Reference Implementation for React Native

## What This App Is

This is a **REFERENCE IMPLEMENTATION** demonstrating the correct way to use StackLive DSL in React Native applications. It serves as a guide for developers building native mobile apps with the StackLive platform.

## Key Points

### ✅ CORRECT Approach (What We Did)

1. **Use the DSL** - Build flows with type-safe builders
2. **Add Polyfills** - Enable Node.js APIs in React Native
3. **Execute with runFlow()** - Run flows as intended
4. **Keep All DSL Benefits** - Type safety, composition, testability

### ❌ WRONG Approach (What We Almost Did)

1. ~~Make plain HTTP calls~~ - Bypasses the entire DSL
2. ~~Skip runFlow()~~ - Defeats the purpose  
3. ~~Lose type safety~~ - No DSL benefits
4. ~~Not a reference~~ - Wrong pattern for others

## Implementation Summary

### React Native Setup

```typescript
// 1. Install dependencies
npm install react-native-get-random-values process

// 2. Create app/polyfills.ts
import 'react-native-get-random-values';
const process = require('process');
if (typeof global.process === 'undefined') {
  global.process = process;
}

// 3. Import FIRST in app/_layout.tsx
import './polyfills';

// 4. Use DSL normally
import { runFlow } from '@stacklive/sdk';
const result = await runFlow(flowAST);
```

### Authentication Flows

```typescript
// Signup
export const userSignUpFlow = (email: string, password: string) =>
  flow('user-signup')
    .step(submit('auth', {
      id: 'signup',
      input: { email, password }
    }))
    .build();

// Login  
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

### Using the Flows

```typescript
// app/services/api.ts
import { runFlow } from '@stacklive/sdk';
import { userSignUpFlow, userLoginFlow } from '../flows/auth';

export async function createUser(email: string, password: string) {
  const flowAST = userSignUpFlow(email, password);
  const result = await runFlow(flowAST);
  
  if (result.execution.status === 'success') {
    const userId = result.execution.results['signup']?.output?.userId;
    return { success: true, userId };
  }
  
  return { success: false, error: 'Signup failed' };
}

export async function authenticateUser(email: string, password: string) {
  const flowAST = userLoginFlow(email, password);
  const result = await runFlow(flowAST);
  
  if (result.execution.status === 'success') {
    const userId = result.execution.results['login']?.output?.userId;
    return { success: true, userId };
  }
  
  return { success: false, error: 'Login failed' };
}
```

## DSL Benefits Preserved

✅ **Type Safety**: Input/output contracts enforced  
✅ **Composition**: Chain multiple capabilities  
✅ **Testability**: Mock flows in tests  
✅ **Abstraction**: Hide backend details  
✅ **Documentation**: Self-documenting flows  
✅ **Consistency**: Same patterns across platforms  

## Files Reference

### Core Implementation
- `app/flows/auth.ts` - DSL flow definitions
- `app/services/api.ts` - Executes flows with runFlow()
- `app/contexts/AuthContext.tsx` - Uses API service
- `app/AuthScreen.tsx` - UI for auth

### React Native Setup
- `app/polyfills.ts` - Node.js polyfills
- `app/_layout.tsx` - Imports polyfills first
- `package.json` - Polyfill dependencies

### Documentation
- `REACT_NATIVE_FIX.md` - Complete React Native guide
- `AUTH_FIX_SUMMARY.md` - Technical summary
- `VISUAL_COMPARISON.md` - Before/after code
- `AUTH_QUICK_REFERENCE.md` - Quick start guide

## For Other Developers

If you're building a React Native app with StackLive DSL:

1. **Follow this reference implementation**
2. **Install polyfills** (react-native-get-random-values, process)
3. **Import polyfills first** in your app entry point
4. **Use the DSL** with flow builders and runFlow()
5. **Don't bypass the DSL** with plain HTTP calls

## Success Criteria

✅ DSL flows defined with builders  
✅ Flows executed with runFlow()  
✅ Polyfills enable SDK in React Native  
✅ Type safety preserved  
✅ Reference implementation complete  
✅ Documentation comprehensive  

## Testing

```bash
npm install
npm start

# Test in app:
# - Sign up new user
# - Log in with credentials  
# - Both use DSL via runFlow()
```

## Final Notes

This implementation demonstrates that:

1. StackLive DSL **CAN** work in React Native
2. Polyfills are the **CORRECT** solution
3. Plain HTTP calls are the **WRONG** approach
4. This serves as the **REFERENCE** for others

---

**Status**: ✅ Complete and Production-Ready  
**Type**: Reference Implementation  
**Purpose**: Show correct DSL usage in React Native  
**Branch**: copilot/fix-dsl-auth-implementations  
**Date**: 2026-04-16
