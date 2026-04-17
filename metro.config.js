/**
 * Metro configuration for React Native
 * 
 * @stacklive/sdk v0.1.5+ includes dual builds (ESM + CommonJS) and
 * proper React Native support via conditional exports. Metro can now
 * resolve the SDK without special configuration.
 *
 * We enable package exports to support modern packages with conditional exports.
 */

const { getDefaultConfig } = require('expo/metro-config');
const nodeLibs = require('node-libs-react-native');

const config = getDefaultConfig(__dirname);

// Enable package.json "exports" field resolution for modern npm packages
config.resolver.unstable_enablePackageExports = true;

// Resolve Node.js core modules for React Native
// This allows @stacklive/sdk to import 'crypto' and other Node modules
config.resolver.extraNodeModules = nodeLibs;

module.exports = config;
