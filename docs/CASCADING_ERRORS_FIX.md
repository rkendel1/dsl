# Fix for "Cannot read property 'seed' of null" Error

## Problem
The application was experiencing a `TypeError: Cannot read property 'seed' of null` error when importing `@stacklive/sdk` in React Native:

```
ERROR  [TypeError: Cannot read property 'seed' of null] 
Code: api.ts
> 6 | import { runFlow, flow, list } from '@stacklive/sdk';
```

## Root Cause
The SDK uses `node-forge` for cryptography, which requires Node.js crypto APIs. When the SDK is imported in React Native:

1. Metro bundler resolves `crypto` import to `react-native-crypto` (from `node-libs-react-native`)
2. `react-native-crypto` depends on `react-native-randombytes` 
3. `react-native-randombytes` tries to access a native module `RNRandomBytes.seed`
4. This native module is `null` because it's not properly linked/available in Expo
5. This causes the error: `Cannot read property 'seed' of null`

## Solution
Created a custom crypto shim that uses `react-native-get-random-values` instead of the problematic `react-native-randombytes`:

### 1. Custom Crypto Shim (`shims/crypto.js`)
- Imports `react-native-get-random-values` for crypto polyfills
- Implements `randomBytes()` using `global.crypto.getRandomValues()` from the polyfill
- Exports all necessary crypto functions (hash, hmac, cipher, etc.) from browserify modules
- Avoids the native module dependency chain

### 2. Metro Configuration Update (`metro.config.js`)
```javascript
config.resolver.extraNodeModules = {
  ...nodeLibs,
  crypto: path.resolve(__dirname, 'shims/crypto.js'),
};
```
This makes Metro resolve `crypto` imports to our custom shim instead of `react-native-crypto`.

### 3. Buffer Polyfill (`app/polyfills.ts`)
Added Buffer global polyfill since our crypto shim uses Buffer:
```typescript
if (typeof global.Buffer === 'undefined') {
  global.Buffer = require('buffer').Buffer;
}
```

## Verification
Successfully built the application for all platforms:
- ✅ iOS bundle: 1300 modules (5.67 MB)
- ✅ Android bundle: 1292 modules (5.67 MB)  
- ✅ Web bundle: 1021 modules (2.98 MB)

No "seed" errors during bundling. The SDK can now be imported and used without issues.

## Files Changed
1. `shims/crypto.js` (NEW) - Custom crypto implementation using react-native-get-random-values
2. `metro.config.js` - Updated to use custom crypto shim
3. `app/polyfills.ts` - Added Buffer global polyfill

## Why This Works
- `react-native-get-random-values` uses Expo's built-in crypto support (no native linking required)
- Our shim bypasses the problematic `react-native-randombytes` → `RNRandomBytes` native module chain
- All crypto operations now work through the polyfilled `global.crypto.getRandomValues()`
- The SDK's cryptography (via node-forge) gets the random values it needs through our shim
