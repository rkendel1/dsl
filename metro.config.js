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
const path = require('path');

const config = getDefaultConfig(__dirname);

// Enable package.json "exports" field resolution for modern npm packages
config.resolver.unstable_enablePackageExports = true;

// Resolve Node.js core modules for React Native
// Use our custom crypto shim instead of react-native-crypto to avoid
// the problematic react-native-randombytes native module dependency
config.resolver.extraNodeModules = {
  ...nodeLibs,
  crypto: path.resolve(__dirname, 'shims/crypto.js'),
};

module.exports = config;
