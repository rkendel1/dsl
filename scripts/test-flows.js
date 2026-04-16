/**
 * Test that the auth flows can be created successfully
 */

import('@stacklive/sdk').then((sdk) => {
  const { flow, request, submit } = sdk;
  
  console.log('Testing flow creation...\n');
  
  // Test 1: User signup flow using submit('auth') alias
  try {
    const userSignUpFlow = flow('user-signup')
      .step(
        submit('auth', {
          id: 'signup',
          input: {
            email: 'test@example.com',
            password: 'password123',
          },
        })
      )
      .build();
    console.log('✅ User signup flow:', userSignUpFlow.id);
  } catch (error) {
    console.error('❌ Failed to create user signup flow:', error.message);
    process.exit(1);
  }
  
  // Test 2: User login flow using request('auth') alias
  try {
    const userLoginFlow = flow('user-login')
      .step(
        request('auth', {
          id: 'login',
          input: {
            body: {
              email: 'test@example.com',
              password: 'password123',
            },
            actorType: 'user',
          },
        })
      )
      .build();
    console.log('✅ User login flow:', userLoginFlow.id);
  } catch (error) {
    console.error('❌ Failed to create user login flow:', error.message);
    process.exit(1);
  }
  
  console.log('\n✅ All flow tests passed!');
  process.exit(0);
}).catch((error) => {
  console.error('❌ Failed to import SDK:', error.message);
  process.exit(1);
});
