/**
 * @file SDK Integration Test
 * @description Simple test to verify @stacklive/sdk integration works correctly
 */

import { flow, op, request, runFlow } from '@stacklive/sdk';

/**
 * Test that SDK functions are accessible and can be called
 * This is a simple integration test to verify the @stacklive/sdk package
 * can be imported and used correctly in the React Native environment.
 */
export function verifySDKIntegration() {
  console.log('Testing @stacklive/sdk integration...');
  
  // Test 1: Check that flow function is available
  if (typeof flow !== 'function') {
    throw new Error('flow function is not available from @stacklive/sdk');
  }
  console.log('✅ flow function is available');
  
  // Test 2: Check that op function is available
  if (typeof op !== 'function') {
    throw new Error('op function is not available from @stacklive/sdk');
  }
  console.log('✅ op function is available');
  
  // Test 3: Check that request function is available
  if (typeof request !== 'function') {
    throw new Error('request function is not available from @stacklive/sdk');
  }
  console.log('✅ request function is available');
  
  // Test 4: Check that runFlow function is available
  if (typeof runFlow !== 'function') {
    throw new Error('runFlow function is not available from @stacklive/sdk');
  }
  console.log('✅ runFlow function is available');
  
  // Test 5: Try to create a simple flow
  try {
    const testFlow = flow('test-flow')
      .step(
        op('test.capability', {
          id: 'test-step',
          input: { test: 'data' },
        })
      )
      .build();
    
    if (!testFlow || typeof testFlow !== 'object') {
      throw new Error('flow().build() did not return an object');
    }
    console.log('✅ Successfully created a test flow');
  } catch (error) {
    console.error('❌ Failed to create test flow:', error);
    throw error;
  }
  
  console.log('✅ All SDK integration tests passed!');
  return true;
}

export default verifySDKIntegration;
