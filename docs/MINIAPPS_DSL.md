# Mini Apps List DSL Implementation

## Overview

This document describes the implementation of the DSL flow for listing mini apps on the home page.

## Flow Definition

### Mini Apps List Flow

**File**: `/app/flows/miniapps.ts`

The `miniappsListFlow` creates a DSL flow that fetches all mini apps using the `miniapps.list` capability.

```typescript
import { flow, list } from '@stacklive/sdk';

export const miniappsListFlow = () =>
  flow('miniapps-list')
    .step(list('miniapps', { id: 'list-apps' }))
    .build();
```

**Flow Details**:
- **Flow ID**: `miniapps-list`
- **Capability**: `miniapps.list`
- **Verb**: `list` (fetch collection)
- **Resource**: `miniapps`
- **Step ID**: `list-apps`
- **Endpoint**: `GET /api/miniapps/list`

## API Integration

**File**: `/app/services/api.ts`

The `fetchMiniApps()` function uses the DSL flow to fetch mini apps from the backend:

```typescript
export async function fetchMiniApps(): Promise<MiniApp[]> {
  try {
    // Use the DSL flow to fetch mini apps
    const flowAST = miniappsListFlow();
    const result = await runFlow(flowAST);
    
    if (result.execution.status === 'success') {
      // Extract apps from the flow execution result
      const listAppsStep = result.execution.results['list-apps'];
      const apps = listAppsStep?.output?.apps as MiniApp[] | undefined;
      
      if (!apps) {
        console.error('Mini apps list succeeded but no apps returned');
        return [];
      }
      
      return apps;
    } else {
      // Handle error
      const failedStep = Object.values(result.execution.results).find(step => step.status === 'error');
      console.error('Failed to fetch mini apps:', failedStep?.error || 'Unknown error');
      return [];
    }
  } catch (error) {
    console.error('Error fetching mini apps:', error);
    // Fallback to mock data for development when backend is not available
    return mockMiniApps;
  }
}
```

## Response Structure

The DSL flow execution returns a structured response:

```typescript
{
  execution: {
    status: 'success',
    flowId: 'miniapps-list',
    executedAt: 1776370132551,
    results: {
      'list-apps': {
        status: 'ok',
        executedAt: 1776370134804,
        intentId: 'list-apps',
        verb: 'list',
        resource: 'miniapps',
        output: {
          apps: [
            {
              id: 'kh796zrh8hdymahc7b91sz5pgx84ksh3',
              name: 'Workout Generator',
              description: 'Workout generator...',
              launch_url: 'https://...',
              icon: 'Box',
              icon_type: 'url',
              icon_url: 'https://...',
              gradient: 'linear-gradient(...)',
              primary_color: '#4A90E2',
              secondary_color: '#50E3C2',
              categories: ['Health & Fitness'],
              rating: null,
              reviews: null,
              creator_id: 'b6414fa1-4ee2-405a-84f2-6d0d3356a5f7',
              creator_email: 'randy@kendelconsulting.com',
              status: 'published',
              is_featured: true,
              is_new_this_week: false,
              is_trending: false,
              // ... other fields
            },
            // ... more apps
          ]
        }
      }
    }
  },
  ui: {
    type: 'flow_result',
    summary: {
      status: 'success',
      title: 'Flow Complete'
    },
    sections: [
      {
        type: 'step',
        id: 'list-apps',
        title: 'List Apps',
        status: 'ok',
        artifacts: []
      }
    ],
    primaryAction: {
      label: 'Done',
      type: 'dismiss'
    }
  }
}
```

## Home Page Integration

**File**: `/app/contexts/AppContext.tsx`

The `AppProvider` component manages the app state and uses the DSL flow:

1. **Fetch Apps**: Calls `fetchMiniApps()` which uses the DSL flow
2. **Filter Apps**: Uses helper functions to filter apps by category:
   - `getFeaturedApps()` - Apps where `is_featured === true`
   - `getNewThisWeekApps()` - Apps where `is_new_this_week === true`
   - `getTrendingApps()` - Apps where `is_trending === true`

**File**: `/app/(tabs)/HomeScreen.tsx`

The home screen displays the filtered apps in sections:

1. **Featured Section**: Horizontal carousel showing featured apps
2. **New This Week Section**: Grid showing new apps

## Data Flow

```
1. HomeScreen renders
   ↓
2. useApp() hook from AppContext
   ↓
3. AppContext calls fetchMiniApps()
   ↓
4. fetchMiniApps() creates miniappsListFlow()
   ↓
5. runFlow() executes the DSL flow
   ↓
6. Backend returns list of apps
   ↓
7. Apps are filtered into sections
   ↓
8. HomeScreen displays sections
```

## Fallback Behavior

When the backend is unavailable or the DSL flow fails:
- The app falls back to mock data defined in `api.ts`
- This ensures the app remains functional during development
- Mock data includes sample apps with all required fields

## Testing

To test the DSL flow implementation:

1. **Unit Test**: Test the flow definition structure
2. **Integration Test**: Test the API service with the DSL flow
3. **End-to-End Test**: Test the full flow from HomeScreen to backend

## Benefits of DSL Implementation

1. **Declarative**: Flow definition is clear and readable
2. **Type-Safe**: TypeScript provides compile-time type checking
3. **Reusable**: Flow can be reused across different screens
4. **Maintainable**: Changes to the flow are centralized
5. **Testable**: Easy to test and mock
6. **Consistent**: Follows the same pattern as other DSL flows (auth, etc.)

## Related Files

- `/app/flows/miniapps.ts` - Flow definition
- `/app/flows/index.ts` - Flow exports
- `/app/services/api.ts` - API integration
- `/app/contexts/AppContext.tsx` - State management
- `/app/(tabs)/HomeScreen.tsx` - UI display
- `/app/types/index.ts` - Type definitions

## References

- [StackLive SDK Documentation](https://www.stacklive.dev/sample/dsl)
- [@stacklive/sdk on npm](https://www.npmjs.com/package/@stacklive/sdk)
- Issue #16: "DSL for List Mini Apps in the home page"
