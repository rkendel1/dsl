/**
 * @file Mini Apps Flow Test
 * @description Test to verify miniapps list flow works correctly
 */

import { list, flow } from '@stacklive/sdk';
import { miniappsListFlow } from '../../flows/miniapps';

/**
 * Test that miniapps list flow can be created and has the correct structure
 */
export function verifyMiniAppsFlow() {
  console.log('Testing miniapps list flow...');
  
  // Test 1: Check that list function is available
  if (typeof list !== 'function') {
    throw new Error('list function is not available from @stacklive/sdk');
  }
  console.log('✅ list function is available');
  
  // Test 2: Create the miniapps list flow
  try {
    const flowAST = miniappsListFlow();
    
    if (!flowAST || typeof flowAST !== 'object') {
      throw new Error('miniappsListFlow() did not return an object');
    }
    console.log('✅ Successfully created miniapps list flow');
    
    // Test 3: Verify flow structure
    if (!flowAST.id || flowAST.id !== 'miniapps-list') {
      throw new Error('Flow ID is not correct');
    }
    console.log('✅ Flow ID is correct: miniapps-list');
    
    // Test 4: Verify flow has steps
    if (!flowAST.steps || !Array.isArray(flowAST.steps) || flowAST.steps.length === 0) {
      throw new Error('Flow does not have steps');
    }
    console.log('✅ Flow has steps');
    
    // Test 5: Verify step configuration
    const listStep = flowAST.steps[0];
    if (!listStep || listStep.id !== 'list-apps') {
      throw new Error('Step ID is not correct');
    }
    console.log('✅ Step ID is correct: list-apps');
    
    if (listStep.verb !== 'list') {
      throw new Error('Step verb is not correct');
    }
    console.log('✅ Step verb is correct: list');
    
    if (listStep.resource !== 'miniapps') {
      throw new Error('Step resource is not correct');
    }
    console.log('✅ Step resource is correct: miniapps');
    
  } catch (error) {
    console.error('❌ Failed to create miniapps list flow:', error);
    throw error;
  }
  
  console.log('✅ All miniapps flow tests passed!');
  return true;
}

export default verifyMiniAppsFlow;
