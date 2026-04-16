/**
 * @file Auth Flows
 * @description DSL flow definitions for user authentication and account management
 */

import { flow, request, submit } from '@stacklive/sdk';

/**
 * User signup flow using DSL
 * Uses auth.userSignUp capability for standard user self-registration
 * 
 * DSL Alias: submit('auth') → auth.submit → auth.userSignUp
 * 
 * This is for end-user self-registration without session binding.
 * For session-bound signup, use auth.signUpUser instead.
 */
export const userSignUpFlow = (email: string, password: string, subdomain?: string) =>
  flow('user-signup')
    .step(
      submit('auth', {
        id: 'signup',
        input: {
          email,
          password,
          subdomain,
        },
      })
    )
    .build();

/**
 * User login flow using DSL
 * Uses auth.authenticate capability for simple authentication
 * 
 * DSL Alias: request('auth') → auth.request → auth.authenticate
 * 
 * This is for simple login flows without session binding.
 * For session-bound login, use auth.credentialsLogin instead.
 */
export const userLoginFlow = (email: string, password: string, actorType: 'user' | 'creator' | 'platform' = 'user') =>
  flow('user-login')
    .step(
      request('auth', {
        id: 'login',
        input: {
          body: {
            email,
            password,
          },
          actorType,
        },
      })
    )
    .build();

export default () => null;
