/**
 * @file DSL Flow Usage Examples
 * @description Examples of how to use the DSL flows in the application
 */

import { runFlow } from '@stacklive/sdk';
import { 
  userSignUpFlow, 
  userLoginFlow 
} from '../flows/auth';

/**
 * Example 1: Sign up a new user
 * This uses the auth.userSignUp capability via submit('auth') alias
 */
export async function exampleUserSignUp() {
  const email = 'newuser@example.com';
  const password = 'securePassword123';

  // Build the flow
  const flowAST = userSignUpFlow(email, password);

  try {
    // Execute the flow
    const result = await runFlow(flowAST);

    if (result.execution.status === 'success') {
      const signupStep = result.execution.results['signup'];
      const userId = signupStep?.output?.userId;
      const supabaseUserId = signupStep?.output?.supabaseUserId;
      
      console.log('User signed up successfully:', { userId, supabaseUserId });
      return { success: true, userId: userId || supabaseUserId };
    } else {
      const failedStep = Object.values(result.execution.results).find(step => step.status === 'error');
      console.error('Sign up failed:', failedStep?.error);
      return { success: false, error: failedStep?.error || 'Sign up failed' };
    }
  } catch (error) {
    console.error('Flow execution error:', error);
    return { success: false, error: 'Network error' };
  }
}

/**
 * Example 2: Login with email and password
 * This uses the auth.authenticate capability via request('auth') alias
 */
export async function exampleUserLogin() {
  const email = 'user@example.com';
  const password = 'securePassword123';

  // Build the flow
  const flowAST = userLoginFlow(email, password);

  try {
    // Execute the flow
    const result = await runFlow(flowAST);

    if (result.execution.status === 'success') {
      const loginStep = result.execution.results['login'];
      const userId = loginStep?.output?.userId;

      console.log('Login successful:', { userId });
      return { success: true, userId };
    } else {
      const failedStep = Object.values(result.execution.results).find(step => step.status === 'error');
      console.error('Login failed:', failedStep?.error);
      return { success: false, error: failedStep?.error || 'Login failed' };
    }
  } catch (error) {
    console.error('Flow execution error:', error);
    return { success: false, error: 'Network error' };
  }
}

/**
 * Example 3: Using flows in React components
 */
export function useAuthFlows() {
  const signup = async (email: string, password: string) => {
    const flowAST = userSignUpFlow(email, password);
    const result = await runFlow(flowAST);
    
    if (result.execution.status === 'success') {
      const userId = result.execution.results['signup']?.output?.userId;
      return { success: true, userId };
    }
    return { success: false, error: 'Signup failed' };
  };

  const login = async (email: string, password: string) => {
    const flowAST = userLoginFlow(email, password);
    const result = await runFlow(flowAST);
    
    if (result.execution.status === 'success') {
      const userId = result.execution.results['login']?.output?.userId;
      return { success: true, userId };
    }
    return { success: false, error: 'Login failed' };
  };

  return { signup, login };
}

export default () => null;
