# @stacklive/sdk ESM Integration Fix

## Problem

The `@stacklive/sdk` package was not working in the React Native app, causing a syntax error:

```
ERROR  [SyntaxError: 1:22:Invalid expression encountered] 

Code: api.ts
> 6 | import { runFlow } from '@stacklive/sdk';
```

## Root Cause

The `@stacklive/sdk` package is published as an **ES Module** (`"type": "module"` in package.json), which uses:
- ES6 `import` statements instead of CommonJS `require()`
- Modern JavaScript features like private class fields (`#field`)
- Bare module imports (e.g., `import 'node-forge'`)

React Native's Metro bundler **doesn't fully support ESM packages** by default, leading to parsing errors when trying to bundle the SDK.

## Solution

Updated the Metro bundler configuration to properly handle ESM packages.

### Key Changes in metro.config.js

1. **`unstable_enablePackageExports: true`** - Tells Metro to respect the `exports` field in package.json
2. **Extended `sourceExts`** - Added `.mjs` and `.cjs` extensions for ES module files
3. **Transformer configuration** - Configured proper transform options for ESM syntax
4. **Explicit module resolution** - Set up watch folders and module paths

## Verification

### Testing SDK Import

Run the verification script:
```bash
node scripts/test-sdk-import.js
```

### Building the App

Build for iOS:
```bash
npx expo export --platform ios --clear
```

Build for web:
```bash
npx expo export --platform web --clear
```

### Using the SDK

```typescript
import { runFlow, flow, op, request } from '@stacklive/sdk';

const userFlow = flow('user-create')
  .step(op('users.create', { id: 'create-user', input: { email, password } }))
  .build();

const result = await runFlow(userFlow);
```

## Files Modified

- `metro.config.js` - Updated Metro bundler configuration
- `scripts/test-sdk-import.js` - Added verification script
- `app/services/__tests__/sdk-integration.test.ts` - Added integration test
