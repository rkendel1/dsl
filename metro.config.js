/**
 * Metro configuration for React Native
 * 
 * @stacklive/sdk v0.1.6+ no longer bundles node-forge and does not require
 * crypto polyfills or shims. The SDK now works seamlessly with React Native
 * via dual builds (ESM + CommonJS) and proper conditional exports.
 *
 * We enable package exports to support modern packages with conditional exports.
 */

const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Enable package.json "exports" field resolution for modern npm packages
config.resolver.unstable_enablePackageExports = true;

module.exports = config;
