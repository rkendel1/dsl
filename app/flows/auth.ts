/**
 * @file Auth Flows
 * @description DSL flow definitions for user authentication and account management
 */

import { flow, op, request } from '@stacklive/sdk';

/**
 * Create user flow using DSL
 * Uses users.create capability to create a new user account
 * 
 * Reference from issue:
 * op('users.create') → capability ID: users.create → POST /api/users/create
 */
export const createUserFlow = (email: string, password: string, roleIds: string[] = ['role_user']) =>
  flow('user-create')
    .step(
      op('users.create', {
        id: 'create-user',
        input: {
          email,
          password,
          roleIds,
        },
      })
    )
    .build();

/**
 * Sign up user flow using DSL
 * Uses auth.signUpUser capability to create a new user with session binding
 * 
 * From image: 
 * const signupFlow = flow('user-signup')
 *   .step('register', intent(request('auth.signUpUser')))
 */
export const signUpUserFlow = (
  email: string,
  password: string,
  sessionToken?: string,
  subdomain?: string
) =>
  flow('user-signup')
    .step(
      request('auth.signUpUser', {
        id: 'register',
        input: {
          email,
          password,
          sessionToken,
          subdomain,
        },
      })
    )
    .build();

/**
 * Credentials login flow using DSL
 * Uses auth.credentialsLogin capability for session-bound authentication
 * 
 * From image:
 * const credentialsFlow = flow('credentials-login')
 *   .step('login', intent(request('auth.credentialsLogin')))
 */
export const credentialsLoginFlow = (email: string, password: string, sessionToken?: string) =>
  flow('credentials-login')
    .step(
      request('auth.credentialsLogin', {
        id: 'login',
        input: {
          email,
          password,
          sessionToken,
        },
      })
    )
    .build();

/**
 * Authenticate user flow using DSL
 * Uses auth.authenticate capability for platform owner authentication
 * 
 * From image:
 * const loginFlow = flow('user-login')
 *   .step('authenticate', intent(request('auth.authenticate')))
 */
export const authenticateUserFlow = (email: string, password: string, actorType: string = 'user') =>
  flow('user-login')
    .step(
      request('auth.authenticate', {
        id: 'authenticate',
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
