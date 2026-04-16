# React Native Compatibility Fix

## Problem

React Native doesn't work well with the `runFlow` function from `@stacklive/sdk`. This causes issues when trying to execute DSL flows in a React Native environment.

## Solution

Instead of using `runFlow`, we make direct HTTP API calls to the StackLive backend using the native `fetch` API, which is fully supported in React Native.

## Changes Made

### 1. Created API Configuration (`app/config/api.ts`)

```typescript
export const API_CONFIG = {
  BASE_URL: process.env.EXPO_PUBLIC_API_URL || 'https://api.stacklive.app',
  ENDPOINTS: {
    AUTH_SIGNUP: '/api/auth/signup',
    AUTH_LOGIN: '/api/auth/login',
    AUTH_USER_SIGNUP: '/api/auth/user-signup',
    MINIAPPS_LIST: '/api/miniapps',
    USER_PROFILE: '/api/users/profile',
    USER_FAVORITES: '/api/users/favorites',
  },
  TIMEOUT: 30000,
};
```

### 2. Created Helper Function for API Requests

```typescript
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ success: boolean; data?: T; error?: string }>
```

This helper:
- Handles timeouts
- Provides consistent error handling
- Returns a standard response format
- Works perfectly in React Native

### 3. Updated `app/services/api.ts`

**Before (using runFlow):**
```typescript
import { runFlow } from '@stacklive/sdk';

export async function createUser(email: string, password: string) {
  const flowAST = userSignUpFlow(email, password);
  const result = await runFlow(flowAST); // ❌ Doesn't work in React Native
  // ...
}
```

**After (using fetch):**
```typescript
import { apiRequest, API_CONFIG } from '../config/api';

export async function createUser(email: string, password: string) {
  const result = await apiRequest<{ userId: string }>(
    API_CONFIG.ENDPOINTS.AUTH_USER_SIGNUP,
    {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }
  ); // ✅ Works in React Native
  // ...
}
```

## API Endpoints

The following endpoints are called directly:

### Authentication

1. **User Signup**
   - Endpoint: `POST /api/auth/user-signup`
   - Body: `{ email, password }`
   - Response: `{ userId, supabaseUserId? }`
   - Maps to DSL: `submit('auth')` → `auth.userSignUp`

2. **User Login**
   - Endpoint: `POST /api/auth/login`
   - Body: `{ email, password, actorType }`
   - Response: `{ userId, token? }`
   - Maps to DSL: `request('auth')` → `auth.authenticate`

### Mini Apps

3. **List Mini Apps**
   - Endpoint: `GET /api/miniapps`
   - Response: `{ apps: MiniApp[] }`
   - Maps to DSL: `list('miniapps')`

## Configuration

### Environment Variables

Create a `.env` file with:

```bash
EXPO_PUBLIC_API_URL=https://api.stacklive.app
```

For local development:

```bash
EXPO_PUBLIC_API_URL=http://localhost:3000
```

### Backend Requirements

Your StackLive backend must expose these REST API endpoints that correspond to the DSL capabilities:

- `POST /api/auth/user-signup` → Calls `auth.userSignUp` capability
- `POST /api/auth/login` → Calls `auth.authenticate` capability
- `GET /api/miniapps` → Calls `miniapps.list` capability

## Benefits

✅ **React Native Compatible**: Uses native fetch API  
✅ **No runFlow Issues**: Bypasses DSL runtime execution  
✅ **Proper Error Handling**: Consistent error format  
✅ **Timeout Support**: Prevents hanging requests  
✅ **Environment Configuration**: Easy to switch between dev/staging/prod  
✅ **Type Safe**: TypeScript generics for responses  

## DSL Flows Still Available

The DSL flow definitions in `app/flows/auth.ts` are still maintained for documentation and potential future use, but they're not executed via `runFlow` in the React Native app. Instead, we make direct API calls that invoke the same backend capabilities.

## Migration Notes

If you were using `runFlow` before:

1. ✅ Flow definitions kept for reference
2. ✅ Same auth capabilities called on backend
3. ✅ Same input/output contracts
4. ✅ Just uses HTTP instead of `runFlow`

## Testing

```bash
# Test that API calls work
npm start

# In the app, try:
# - Sign up a new user
# - Log in
# - View mini apps list
```

All operations now use direct HTTP calls instead of `runFlow`.

## Troubleshooting

### "Network request failed"
- Check `EXPO_PUBLIC_API_URL` environment variable
- Verify backend is running and accessible
- Check network connectivity

### "Request timeout"
- Backend might be slow or down
- Check `API_CONFIG.TIMEOUT` setting
- Verify backend endpoints are responding

### "HTTP 404" or "HTTP 500"
- Verify backend endpoints match configuration
- Check backend logs for errors
- Ensure capabilities are registered in backend
