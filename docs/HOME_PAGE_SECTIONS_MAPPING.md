# Home Page Sections Mapping

This document explains how the DSL flow response maps to the home page sections as shown in the reference screenshot.

## Screenshot Analysis

Based on the provided screenshot, the home page has the following sections:

1. **Header**
   - Title: "Home"
   - Profile icon (top right)

2. **Search Bar**
   - Placeholder: "Search home..."
   - Search icon (magnifying glass)

3. **Featured Section**
   - Title: "Featured"
   - "See all" link
   - Horizontal carousel with cards
   - Pagination dots below (indicating multiple featured apps)
   - Example: "Chat Mini" - "Quick messaging for teams"

4. **New This Week Section**
   - Title: "New This Week"
   - "See all" link
   - Vertical list of app cards
   - Examples:
     - "Calculator Pro" - "Advanced math tools"
     - "Note Taker" - "Simple note organization"
     - "Todo List" - "Task management app"

## DSL Response Mapping

### Flow Execution

```typescript
// DSL Flow Call
const flowAST = miniappsListFlow();
const result = await runFlow(flowAST);

// Response structure
{
  execution: {
    status: 'success',
    flowId: 'miniapps-list',
    results: {
      'list-apps': {
        output: {
          apps: [/* array of apps */]
        }
      }
    }
  }
}
```

### Apps Array Structure

Each app in the response includes flags that determine which section it appears in:

```typescript
{
  id: 'kh796zrh8hdymahc7b91sz5pgx84ksh3',
  name: 'Workout Generator',
  description: 'Workout generator based on what you have...',
  launch_url: 'https://admin.stacklive.dev/workout-generator?webview=true',
  icon: 'Box',
  icon_type: 'url',
  icon_url: 'https://...',
  gradient: 'linear-gradient(135deg, #4A90E2, #50E3C2)',
  primary_color: '#4A90E2',
  secondary_color: '#50E3C2',
  categories: ['Health & Fitness'],
  rating: null,
  reviews: null,
  status: 'published',
  
  // Section flags
  is_featured: true,        // ← Shows in Featured section
  is_new_this_week: false,  // ← Shows in New This Week section
  is_trending: false,       // ← Shows in Trending section
}
```

## Filtering Logic

The apps are filtered into sections using helper functions in `app/services/api.ts`:

### 1. Featured Apps
```typescript
export function getFeaturedApps(apps: MiniApp[]): MiniApp[] {
  return apps.filter(app => app.is_featured);
}
```

**Maps to**: Featured carousel section on home page

**Example from response**:
- Workout Generator (is_featured: true)
- Duck Hunt (is_featured: true)
- Puzzles (is_featured: true)
- Smart Post (is_featured: true)
- Tip Calculator (is_featured: true)
- Unit Converter (is_featured: true)

### 2. New This Week Apps
```typescript
export function getNewThisWeekApps(apps: MiniApp[]): MiniApp[] {
  return apps.filter(app => app.is_new_this_week);
}
```

**Maps to**: New This Week list section on home page

**Example from response**:
- Embbeded game (is_new_this_week: true)
- Connect Four (is_new_this_week: true)
- Reply AI (is_new_this_week: true)
- TicTacToe (is_new_this_week: true)

### 3. Trending Apps
```typescript
export function getTrendingApps(apps: MiniApp[]): MiniApp[] {
  return apps.filter(app => app.is_trending);
}
```

**Maps to**: Trending section (accessible via "See all" or dedicated Trending tab)

**Example from response**:
- Blackjack (is_trending: true)
- Solitaire (is_trending: true)
- Battleship (is_trending: true)
- WiFi QR Code (is_trending: true)
- Budget Helper (is_trending: true)

## UI Component Structure

```
HomeScreen
├── Header
│   ├── Title: "Home"
│   └── Profile Button
├── Search Bar
│   └── Input: "Search home..."
└── ScrollView
    ├── Featured Section
    │   ├── Section Header
    │   │   ├── Title: "Featured"
    │   │   └── "See all" link
    │   ├── Horizontal FlatList
    │   │   └── AppCard (variant="featured")
    │   │       ├── Gradient background
    │   │       ├── App name
    │   │       ├── Description
    │   │       └── "Open" button
    │   └── Pagination dots
    └── New This Week Section
        ├── Section Header
        │   ├── Title: "New This Week"
        │   └── "See all" link
        └── Grid Container
            └── AppCard (variant="list")
                ├── Icon
                ├── App name
                ├── Description
                ├── Category
                └── "Open" button
```

## Data Flow Diagram

```
User opens app
    ↓
HomeScreen renders
    ↓
useApp() hook (AppContext)
    ↓
loadApps() function
    ↓
fetchMiniApps() (API service)
    ↓
miniappsListFlow() (DSL flow)
    ↓
runFlow(flowAST) (SDK)
    ↓
GET /api/miniapps/list (Backend)
    ↓
Response with apps array
    ↓
Extract apps from results['list-apps'].output.apps
    ↓
Filter apps into sections:
    ├── getFeaturedApps()
    ├── getNewThisWeekApps()
    └── getTrendingApps()
    ↓
AppContext provides filtered arrays:
    ├── featuredApps
    ├── newThisWeekApps
    └── trendingApps
    ↓
HomeScreen displays sections with FlatList/Grid
    ↓
User sees:
    ├── Featured carousel
    └── New This Week list
```

## Key Points

1. **Single API Call**: One DSL flow fetches all apps
2. **Client-side Filtering**: Apps are filtered into sections based on flags
3. **Flexible Display**: Same data can be shown in different formats (carousel, list, grid)
4. **Consistent Data**: All sections use the same data structure (MiniApp type)
5. **Real-time Updates**: Pull-to-refresh triggers new DSL flow execution

## Benefits

- **Efficiency**: Single API call reduces network overhead
- **Consistency**: All sections show consistent data
- **Flexibility**: Easy to add new sections by filtering on different flags
- **Performance**: Client-side filtering is fast
- **Maintainability**: Clear separation between data fetching and UI display

## Future Enhancements

1. **Dynamic Sections**: Backend could return section configuration
2. **Personalization**: Show different sections based on user preferences
3. **A/B Testing**: Test different section layouts
4. **Lazy Loading**: Load sections on demand as user scrolls
5. **Caching**: Cache sections separately for faster loads
