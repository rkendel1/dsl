/**
 * @file React Native Polyfills for @stacklive/sdk
 * @description Configures polyfills needed for the SDK to work in React Native
 * 
 * The @stacklive/sdk uses node-forge for cryptography which requires Node.js APIs.
 * This file sets up the necessary polyfills for React Native.
 */

// Import crypto polyfill for React Native
import 'react-native-get-random-values';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const process = require('process');

// Polyfill global process if needed
if (typeof global.process === 'undefined') {
  global.process = process;
}

// Set SDK mode
if (global.process && global.process.env) {
  global.process.env.SDK_MODE = 'true';
  global.process.env.NODE_ENV = __DEV__ ? 'development' : 'production';
}

// Export so it can be imported early in the app
export default function setupPolyfills() {
  console.log('✅ React Native polyfills configured for @stacklive/sdk');
}
