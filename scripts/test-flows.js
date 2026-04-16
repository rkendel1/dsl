/**
 * Test that the auth flows can be created successfully
 */

import('@stacklive/sdk').then((sdk) => {
  const { flow, op, request } = sdk;
  
  console.log('Testing flow creation...\n');
  
  // Test 1: Create user flow
  try {
    const createUserFlow = flow('user-create')
      .step(
        op('users.create', {
          id: 'create-user',
          input: {
            email: 'test@example.com',
            password: 'password123',
            roleIds: ['role_user'],
          },
        })
      )
      .build();
    console.log('✅ Create user flow:', createUserFlow.id);
  } catch (error) {
    console.error('❌ Failed to create user flow:', error.message);
    process.exit(1);
  }
  
  // Test 2: Sign up user flow
  try {
    const signUpUserFlow = flow('user-signup')
      .step(
        request('auth.signUpUser', {
          id: 'register',
          input: {
            email: 'test@example.com',
            password: 'password123',
          },
        })
      )
      .build();
    console.log('✅ Sign up user flow:', signUpUserFlow.id);
  } catch (error) {
    console.error('❌ Failed to create sign up flow:', error.message);
    process.exit(1);
  }
  
  // Test 3: Credentials login flow
  try {
    const credentialsLoginFlow = flow('credentials-login')
      .step(
        request('auth.credentialsLogin', {
          id: 'login',
          input: {
            email: 'test@example.com',
            password: 'password123',
          },
        })
      )
      .build();
    console.log('✅ Credentials login flow:', credentialsLoginFlow.id);
  } catch (error) {
    console.error('❌ Failed to create credentials login flow:', error.message);
    process.exit(1);
  }
  
  console.log('\n✅ All flow tests passed!');
  process.exit(0);
}).catch((error) => {
  console.error('❌ Failed to import SDK:', error.message);
  process.exit(1);
});
