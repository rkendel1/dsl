#!/usr/bin/env node

/**
 * Test script to verify @stacklive/sdk imports work correctly
 */

console.log('Testing @stacklive/sdk imports...\n');

try {
  // Try to dynamically import the ESM package
  import('@stacklive/sdk').then((sdk) => {
    console.log('✅ Successfully imported @stacklive/sdk');
    console.log('✅ Available exports:', Object.keys(sdk).slice(0, 10).join(', '), '...');
    
    // Test that the main exports are available
    const requiredExports = ['runFlow', 'flow', 'op', 'request', 'intent'];
    const missingExports = requiredExports.filter(exp => !sdk[exp]);
    
    if (missingExports.length === 0) {
      console.log('✅ All required exports are available');
      process.exit(0);
    } else {
      console.error('❌ Missing exports:', missingExports.join(', '));
      process.exit(1);
    }
  }).catch((error) => {
    console.error('❌ Failed to import @stacklive/sdk:', error.message);
    process.exit(1);
  });
} catch (error) {
  console.error('❌ Error testing imports:', error.message);
  process.exit(1);
}
