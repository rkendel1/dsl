// Test SDK import with polyfills
console.log('1. Setting up polyfills...');

// Set up process polyfill
global.process = require('process');
if (global.process && !global.process.env) {
  global.process.env = {};
}
global.process.env.SDK_MODE = 'true';
global.process.env.NODE_ENV = 'development';

// Set up crypto polyfills using node-libs-react-native
const nodeLibs = require('node-libs-react-native');
console.log('2. Node libs loaded:', Object.keys(nodeLibs).join(', '));

try {
  console.log('3. Attempting to import SDK...');
  const sdk = require('@stacklive/sdk');
  console.log('4. ✓ SDK imported successfully!');
  console.log('5. SDK exports:', Object.keys(sdk).join(', '));
  
  // Try to use the SDK
  const { flow, list } = sdk;
  console.log('6. Testing flow creation...');
  const testFlow = flow('test').step(list('miniapps', { id: 'test' })).build();
  console.log('7. ✓ Flow created:', testFlow.id);
} catch (e) {
  console.error('✗ Error:', e.message);
  console.error('Stack:', e.stack);
}
