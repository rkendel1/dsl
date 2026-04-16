/**
 * @file DSL Flow Usage Examples
 * @description Examples of how to use the DSL flows in the application
 */

import { runFlow } from '@stacklive/sdk';
import { 
  createUserFlow, 
  signUpUserFlow, 
  credentialsLoginFlow, 
  authenticateUserFlow 
} from '../flows/auth';

/**
 * Example 1: Create a new user account
 * This uses the users.create capability
 */
export async function exampleCreateUser() {
  const email = 'newuser@example.com';
  const password = 'securePassword123';
  const roleIds = ['role_user'];

  // Build the flow
  const flowAST = createUserFlow(email, password, roleIds);

  try {
    // Execute the flow
    const result = await runFlow(flowAST);

    if (result.execution.status === 'success') {
      const userId = result.execution.results['create-user']?.output?.userId;
      console.log('User created successfully:', userId);
      return { success: true, userId };
    } else {
      const failedStep = Object.values(result.execution.results).find(step => step.status === 'error');
      console.error('User creation failed:', failedStep?.error);
      return { success: false, error: failedStep?.error || 'User creation failed' };
    }
  } catch (error) {
    console.error('Flow execution error:', error);
    return { success: false, error: 'Network error' };
  }
}

/**
 * Example 2: Sign up a new user with session binding
 * This uses the auth.signUpUser capability
 */
export async function exampleSignUpUser() {
  const email = 'newuser@example.com';
  const password = 'Str0ng!Pass#';
  const sessionToken = 'session-token-xyz';
  const subdomain = 'myapp';

  // Build the flow
  const flowAST = signUpUserFlow(email, password, sessionToken, subdomain);

  try {
    // Execute the flow
    const result = await runFlow(flowAST);

    if (result.execution.status === 'success') {
      const registerStep = result.execution.results['register'];
      const userId = registerStep?.output?.userId;
      const successUrl = registerStep?.output?.successUrl;

      console.log('User signed up successfully:', { userId, successUrl });
      return { success: true, userId, successUrl };
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
 * Example 3: Login with email and password (credentials login)
 * This uses the auth.credentialsLogin capability
 */
export async function exampleCredentialsLogin() {
  const email = 'user@example.com';
  const password = 'Str0ng!Pass#';
  const sessionToken = 'session-token-xyz';

  // Build the flow
  const flowAST = credentialsLoginFlow(email, password, sessionToken);

  try {
    // Execute the flow
    const result = await runFlow(flowAST);

    if (result.execution.status === 'success') {
      const loginStep = result.execution.results['login'];
      const userId = loginStep?.output?.userId;
      const successUrl = loginStep?.output?.successUrl || '/dashboard';

      console.log('Login successful:', { userId, successUrl });
      return { success: true, userId, token: sessionToken };
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
 * Example 4: Authenticate user (general authentication)
 * This uses the auth.authenticate capability
 */
export async function exampleAuthenticateUser() {
  const email = 'user@example.com';
  const password = 'Str0ng!Pass#';
  const actorType = 'user'; // or 'platform', 'creator'

  // Build the flow
  const flowAST = authenticateUserFlow(email, password, actorType);

  try {
    // Execute the flow
    const result = await runFlow(flowAST);

    if (result.execution.status === 'success') {
      const authStep = result.execution.results['authenticate'];
      const userId = authStep?.output?.userId;

      console.log('Authentication successful:', { userId });
      return { success: true, userId };
    } else {
      const failedStep = Object.values(result.execution.results).find(step => step.status === 'error');
      console.error('Authentication failed:', failedStep?.error);
      return { success: false, error: failedStep?.error || 'Authentication failed' };
    }
  } catch (error) {
    console.error('Flow execution error:', error);
    return { success: false, error: 'Network error' };
  }
}

/**
 * Example 5: Using flows in React components
 */
export function useAuthFlows() {
  const signup = async (email: string, password: string) => {
    const flowAST = signUpUserFlow(email, password);
    const result = await runFlow(flowAST);
    
    if (result.execution.status === 'success') {
      const userId = result.execution.results['register']?.output?.userId;
      return { success: true, userId };
    }
    return { success: false, error: 'Signup failed' };
  };

  const login = async (email: string, password: string) => {
    const flowAST = credentialsLoginFlow(email, password);
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
