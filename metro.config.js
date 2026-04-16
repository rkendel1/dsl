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
const path = require('path');

const config = getDefaultConfig(__dirname);

// Enable package.json "exports" field resolution so Metro can correctly
// resolve @stacklive/sdk (an ESM package) and other modern npm packages.
config.resolver.unstable_enablePackageExports = true;

// Add .mjs and .cjs extensions
config.resolver.sourceExts = ['js', 'jsx', 'json', 'ts', 'tsx', 'cjs', 'mjs'];

// Disable symlinks to avoid issues with linked packages
config.resolver.unstable_enableSymlinks = false;

// Configure transformer to handle ESM packages
// We need to ensure node_modules/@stacklive/sdk is transpiled
config.transformer = {
  ...config.transformer,
  getTransformOptions: async () => ({
    transform: {
      experimentalImportSupport: false,
      inlineRequires: true,
    },
  }),
};

// Explicitly include @stacklive/sdk for transformation
// By default, Metro doesn't transpile node_modules, but we need it for ESM packages
const nodeModulesPath = path.resolve(__dirname, 'node_modules');
const stackliveSdkPath = path.join(nodeModulesPath, '@stacklive/sdk');

config.watchFolders = [nodeModulesPath];

// Override module resolution to handle the SDK package
config.resolver.extraNodeModules = {
  '@stacklive/sdk': stackliveSdkPath,
};

module.exports = config;
