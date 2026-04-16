/**
 * Metro configuration for React Native
 * 
 * @stacklive/sdk is published as an ES module ("type": "module").
 * React Native's Metro bundler requires explicit opt-in to resolve
 * package.json "exports" fields (including ESM-only packages).
 *
 * `unstable_enablePackageExports: true` tells Metro to honour the
 * "exports" map in package.json, which is required for @stacklive/sdk
 * to resolve correctly in a native bundle.
 *
 * Reference:
 *   https://reactnative.dev/docs/metro#unstable_enablepackageexports-experimental
 */

const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Enable package.json "exports" field resolution so Metro can correctly
// resolve @stacklive/sdk (an ESM package) and other modern npm packages.
config.resolver.unstable_enablePackageExports = true;

module.exports = config;
