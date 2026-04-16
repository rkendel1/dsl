# @stacklive/sdk Integration - Version History

## Version 0.1.5 (Current) ✅

**SDK Changes:**
- ✅ Dual builds: ESM (`dist/index.js`) + CommonJS (`dist/index.cjs`)
- ✅ Removed `node-forge` and `qrcode` peer dependencies (phantom dependencies removed)
- ✅ Added React Native conditional exports
- ✅ Proper `package.json` exports field with `react-native`, `import`, and `require` conditions

**Integration Status:**
- ✅ Works seamlessly with React Native Metro bundler
- ✅ No special configuration needed (minimal Metro config)
- ✅ All SDK functions and flows work correctly

## Version 0.1.4 (Previous) ⚠️

**Problem:**

The `@stacklive/sdk` package was not working in the React Native app, causing a syntax error:

```
ERROR  [SyntaxError: 1:22:Invalid expression encountered] 

Code: api.ts
> 6 | import { runFlow } from '@stacklive/sdk';
```

**Root Cause:**

The `@stacklive/sdk` v0.1.4 was published as an **ES Module only** (`"type": "module"` in package.json), which:
- Only provided ESM build (no CommonJS fallback)
- Had peer dependencies on `node-forge` and `qrcode` (never actually imported - phantom dependencies)
- Required extensive Metro bundler configuration workarounds

**Solution (v0.1.4):**

Updated the Metro bundler configuration to properly handle ESM-only packages with extensive workarounds.

### Metro Configuration Changes (v0.1.4 → v0.1.5)

**v0.1.4 (55 lines with workarounds):**
```javascript
// Required extensive configuration
config.resolver.unstable_enablePackageExports = true;
config.resolver.sourceExts = ['js', 'jsx', 'json', 'ts', 'tsx', 'cjs', 'mjs'];
config.resolver.unstable_enableSymlinks = false;
config.transformer = { /* custom settings */ };
config.watchFolders = [nodeModulesPath];
config.resolver.extraNodeModules = { /* custom paths */ };
```

**v0.1.5 (17 lines, simplified):**
```javascript
// Minimal configuration needed
const config = getDefaultConfig(__dirname);
config.resolver.unstable_enablePackageExports = true;
module.exports = config;
```

The new SDK version with dual builds eliminates the need for:
- ❌ Custom source extensions
- ❌ Transformer configuration
- ❌ Watch folders setup
- ❌ Extra node modules mapping
- ❌ Symlink disabling

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

**Version 0.1.5 Update:**
- `package.json` - Updated `@stacklive/sdk` from `^0.1.4` to `^0.1.5`
- `metro.config.js` - Simplified from 55 lines to 17 lines (removed ESM-only workarounds)

**Version 0.1.4 Integration (Historical):**
- `metro.config.js` - Added extensive Metro bundler configuration for ESM-only package
- `scripts/test-sdk-import.js` - Added verification script
- `app/services/__tests__/sdk-integration.test.ts` - Added integration test

## Benefits of v0.1.5 Upgrade

1. **Simpler Configuration** - Minimal Metro config required
2. **Better Compatibility** - Dual builds work with any bundler
3. **No Phantom Dependencies** - Removed unused `node-forge` and `qrcode` peer dependencies
4. **React Native First** - Proper conditional exports for React Native environment
5. **Faster Development** - Less configuration means faster setup and fewer issues
