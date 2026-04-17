/**
 * @file React Native Polyfills for @stacklive/sdk
 * @description Configures polyfills needed for the SDK to work in React Native
 * 
 * The @stacklive/sdk uses node-forge for cryptography which requires Node.js APIs.
 * This file sets up the necessary polyfills for React Native.
 * 
 * IMPORTANT: This file MUST be imported before any code that uses @stacklive/sdk
 */

// Import crypto polyfill for React Native - MUST be first
import 'react-native-get-random-values';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const process = require('process');

// Polyfill global process if needed
if (typeof global.process === 'undefined') {
  global.process = process;
}

// Ensure process.env exists
if (global.process && !global.process.env) {
  global.process.env = {};
}

// Set SDK mode and environment
if (global.process && global.process.env) {
  global.process.env.SDK_MODE = 'true';
  // @ts-ignore - __DEV__ is a global in React Native
  global.process.env.NODE_ENV = (typeof __DEV__ !== 'undefined' && __DEV__) ? 'development' : 'production';
}

// Log that polyfills are set up (only in development)
// @ts-ignore - __DEV__ is a global in React Native
if (typeof __DEV__ !== 'undefined' && __DEV__) {
  console.log('✅ React Native polyfills configured for @stacklive/sdk');
}

// Export so it can be imported early in the app
export default function setupPolyfills() {
  // Already set up at module load time
}
