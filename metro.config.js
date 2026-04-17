/**
 * Metro configuration for React Native
 * 
 * @stacklive/sdk v0.1.6+ includes dual builds (ESM + CommonJS) and
 * proper React Native support via conditional exports. Metro can now
 * resolve the SDK without special configuration.
 *
 * We enable package exports to support modern packages with conditional exports.
 */

const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Enable package.json "exports" field resolution for modern npm packages
config.resolver.unstable_enablePackageExports = true;

module.exports = config;
