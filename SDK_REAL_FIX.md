# The Real Fix for @stacklive/sdk in React Native

## Current Situation

The `@stacklive/sdk` v0.1.5 **still bundles node-forge** despite the README claiming "No Node.js deps: Removed node-forge". The bundle includes:
- 71,769 lines of code
- 919 references to "forge"
- Full node-forge PRNG implementation with the problematic `seed` property

When used in React Native/Expo, the SDK imports Node.js's `crypto` module:
```javascript
import require$$8 from 'crypto';
```

This triggers a chain reaction:
1. Metro resolves `crypto` → `react-native-crypto`
2. `react-native-crypto` → `react-native-randombytes`  
3. `react-native-randombytes` → tries to access `RNRandomBytes.seed` native module
4. **Native module is null** → Error: `Cannot read property 'seed' of null`

## The Real Fix (What the SDK Should Do)

The SDK maintainers should make these changes:

### Option 1: Remove node-forge entirely (BEST)

**Replace node-forge with Web Crypto API:**

```javascript
// Instead of bundling node-forge, detect the environment
let crypto;

if (typeof window !== 'undefined' && window.crypto) {
  // Browser
  crypto = window.crypto;
} else if (typeof global !== 'undefined' && global.crypto) {
  // React Native with polyfills
  crypto = global.crypto;
} else {
  // Node.js
  crypto = require('crypto').webcrypto || require('crypto');
}

// Use crypto.getRandomValues() and crypto.subtle for crypto operations
```

### Option 2: Provide separate React Native build (GOOD)

Create a true React Native-specific bundle that:
- Uses `react-native-get-random-values` as a peer dependency
- Documents required setup in README
- Doesn't bundle node-forge for React Native target

**Package.json exports:**
```json
{
  "exports": {
    ".": {
      "react-native": "./dist/index.react-native.js",
      "import": "./dist/index.js",
      "require": "./dist/index.cjs"
    }
  }
}
```

**React Native bundle (dist/index.react-native.js):**
```javascript
// Expect the consumer to set up polyfills
if (typeof global.crypto === 'undefined' || !global.crypto.getRandomValues) {
  throw new Error(
    '@stacklive/sdk requires crypto polyfills in React Native.\n' +
    'Add to your entry point:\n' +
    '  import "react-native-get-random-values";\n' +
    'See: https://github.com/stacklive/sdk#react-native-setup'
  );
}

// Use global.crypto instead of importing 'crypto'
```

### Option 3: Make crypto import optional (ACCEPTABLE)

Use dynamic imports or try/catch:

```javascript
let cryptoModule;
try {
  // Try to import crypto (works in Node.js)
  cryptoModule = await import('crypto');
} catch (e) {
  // Fall back to global crypto (React Native, browsers)
  if (typeof global.crypto !== 'undefined') {
    cryptoModule = {
      randomBytes: (size) => {
        const arr = new Uint8Array(size);
        global.crypto.getRandomValues(arr);
        return Buffer.from(arr);
      }
    };
  } else {
    throw new Error('No crypto implementation available');
  }
}
```

## Why Current Workaround is Necessary

Until the SDK is fixed, consuming applications must:

1. **Create a crypto shim** (`shims/crypto.js`) that uses `react-native-get-random-values`
2. **Configure Metro** to resolve `crypto` to the shim
3. **Set up polyfills** before importing the SDK

This is what we implemented in this repository.

## Recommended SDK Changes

**Priority 1: Update README**
- Remove misleading "No Node.js deps" claim
- Add React Native setup instructions
- Document the polyfill requirements

**Priority 2: Fix the build**
- Remove node-forge or make it optional
- Use Web Crypto API when available
- Provide clear error messages when crypto is not available

**Priority 3: Add tests**
- Test React Native integration
- Test with and without native modules
- Test with Expo

## How to Request the Fix

File an issue at: https://github.com/rkendel1/temp_live/issues

**Issue template:**
```markdown
### Problem
The SDK bundles node-forge which requires Node.js crypto module, causing 
"Cannot read property 'seed' of null" errors in React Native/Expo.

### Expected Behavior  
The SDK should work in React Native without requiring custom metro config
and crypto shims.

### Suggested Solutions
1. Remove node-forge and use Web Crypto API
2. OR provide separate React Native bundle  
3. OR make crypto import conditional with clear error messages

### Environment
- @stacklive/sdk: 0.1.5
- React Native: 0.81.5
- Expo: ~54.0.33
```

## Temporary Solution (Current Implementation)

Until the SDK is fixed, use the crypto shim approach documented in `CASCADING_ERRORS_FIX.md`.

This workaround:
- ✅ Works reliably
- ✅ No code changes to SDK
- ✅ Maintains all SDK functionality
- ⚠️ Requires custom Metro config
- ⚠️ Needs to be replicated in each project

## Verification

Our workaround has been tested and verified:
- ✅ iOS builds successfully (1300 modules)
- ✅ Android builds successfully (1292 modules)
- ✅ Web builds successfully (1021 modules)
- ✅ No "seed" errors during bundling
- ✅ SDK imports and runs correctly
