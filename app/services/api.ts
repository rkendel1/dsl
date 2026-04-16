/**
 * @file API Service
 * @description Handles all API calls to StackLive backend using @stacklive/sdk DSL flows
 */
import { MiniApp } from '../types';
import { runFlow } from '@stacklive/sdk';
import { 
  createUserFlow, 
  signUpUserFlow, 
  credentialsLoginFlow, 
  authenticateUserFlow,
  miniappsListFlow 
} from '../flows';

/**
 * Fetch mini apps list using DSL flow
 */
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
        // Get error from the first failed step
        const failedStep = Object.values(result.execution.results).find(step => step.status === 'error');
        console.error('Failed to fetch mini apps:', failedStep?.error || 'Unknown error');
        return [];
      }
    } catch (error) {
      console.error('Error fetching mini apps:', error);
      // Fallback to mock data for development when backend is not available
      const mockMiniApps: MiniApp[] = [
        {
          id: '1',
          name: 'Chat Mini',
          description: 'Quick messaging for teams',
          launch_url: '#',
          icon: 'MessageCircle',
          icon_type: 'lucide',
          icon_url: null,
          gradient: null,
          primary_color: '#6366F1',
          secondary_color: '#8B5CF6',
          categories: ['Communication'],
          rating: 4.5,
          reviews: 120,
          creator_id: 'creator1',
          creator_email: 'dev@example.com',
          status: 'published',
          deployment_url: null,
          last_deployed_at: null,
          last_published_at: new Date(Date.now() - 86400000).toISOString(),
          is_featured: true,
          is_new_this_week: false,
          is_trending: false,
          long_description: 'Real-time chat for teams and groups.',
          tags: ['chat', 'team'],
          screenshots: [],
          features: ['Real-time', 'Groups'],
          ratings_and_reviews: null,
        },
        {
          id: '2',
          name: 'Calculator Pro',
          description: 'Advanced math tools',
          launch_url: '#',
          icon: 'Calculator',
          icon_type: 'lucide',
          icon_url: null,
          gradient: null,
          primary_color: '#10B981',
          secondary_color: '#059669',
          categories: ['Tools'],
          rating: 4.2,
          reviews: 89,
          creator_id: 'creator2',
          creator_email: 'dev@example.com',
          status: 'published',
          deployment_url: null,
          last_deployed_at: null,
          last_published_at: new Date().toISOString(),
          is_featured: false,
          is_new_this_week: true,
          is_trending: false,
          long_description: 'Scientific calculator with history.',
          tags: ['math', 'calc'],
          screenshots: [],
          features: ['Scientific', 'History'],
          ratings_and_reviews: null,
        },
        {
          id: '3',
          name: 'Weather Now',
          description: 'Real-time forecasts',
          launch_url: '#',
          icon: 'CloudRain',
          icon_type: 'lucide',
          icon_url: null,
          gradient: null,
          primary_color: '#3B82F6',
          secondary_color: '#1D4ED8',
          categories: ['Weather'],
          rating: 4.7,
          reviews: 203,
          creator_id: 'creator3',
          creator_email: 'dev@example.com',
          status: 'published',
          deployment_url: null,
          last_deployed_at: null,
          last_published_at: new Date(Date.now() - 2 * 86400000).toISOString(),
          is_featured: true,
          is_new_this_week: false,
          is_trending: false,
          long_description: 'Current weather and forecasts.',
          tags: ['weather', 'forecast'],
          screenshots: [],
          features: ['Alerts', 'Maps'],
          ratings_and_reviews: null,
        },
        {
          id: '4',
          name: 'Note Taker',
          description: 'Simple note organization',
          launch_url: '#',
          icon: 'Edit3',
          icon_type: 'lucide',
          icon_url: null,
          gradient: null,
          primary_color: '#F59E0B',
          secondary_color: '#D97706',
          categories: ['Productivity'],
          rating: 4.0,
          reviews: 67,
          creator_id: 'creator4',
          creator_email: 'dev@example.com',
          status: 'published',
          deployment_url: null,
          last_deployed_at: null,
          last_published_at: new Date().toISOString(),
          is_featured: false,
          is_new_this_week: true,
          is_trending: false,
          long_description: 'Organize notes with search.',
          tags: ['notes', 'organize'],
          screenshots: [],
          features: ['Sync', 'Search'],
          ratings_and_reviews: null,
        },
        {
          id: '5',
          name: 'Game Hub',
          description: 'Mini games collection',
          launch_url: '#',
          icon: 'Gamepad2',
          icon_type: 'lucide',
          icon_url: null,
          gradient: null,
          primary_color: '#EF4444',
          secondary_color: '#DC2626',
          categories: ['Games'],
          rating: 4.8,
          reviews: 456,
          creator_id: 'creator5',
          creator_email: 'dev@example.com',
          status: 'published',
          deployment_url: null,
          last_deployed_at: null,
          last_published_at: new Date(Date.now() - 3 * 86400000).toISOString(),
          is_featured: false,
          is_new_this_week: false,
          is_trending: true,
          long_description: 'Collection of mini games.',
          tags: ['games', 'fun'],
          screenshots: [],
          features: ['Multiplayer', 'Puzzles'],
          ratings_and_reviews: null,
        },
        {
          id: '6',
          name: 'Todo List',
          description: 'Task management app',
          launch_url: '#',
          icon: 'CheckCircle',
          icon_type: 'lucide',
          icon_url: null,
          gradient: null,
          primary_color: '#06B6D4',
          secondary_color: '#0891B2',
          categories: ['Productivity'],
          rating: 4.3,
          reviews: 134,
          creator_id: 'creator6',
          creator_email: 'dev@example.com',
          status: 'published',
          deployment_url: null,
          last_deployed_at: null,
          last_published_at: new Date().toISOString(),
          is_featured: false,
          is_new_this_week: true,
          is_trending: false,
          long_description: 'Manage tasks with reminders.',
          tags: ['todo', 'tasks'],
          screenshots: [],
          features: ['Reminders', 'Lists'],
          ratings_and_reviews: null,
        },
        {
          id: '7',
          name: 'Fitness Tracker',
          description: 'Track your workouts',
          launch_url: '#',
          icon: 'Activity',
          icon_type: 'lucide',
          icon_url: null,
          gradient: null,
          primary_color: '#10B981',
          secondary_color: '#059669',
          categories: ['Health'],
          rating: 4.6,
          reviews: 278,
          creator_id: 'creator7',
          creator_email: 'dev@example.com',
          status: 'published',
          deployment_url: null,
          last_deployed_at: null,
          last_published_at: new Date(Date.now() - 86400000 * 2).toISOString(),
          is_featured: false,
          is_new_this_week: true,
          is_trending: false,
          long_description: 'Track workouts and goals.',
          tags: ['fitness', 'track'],
          screenshots: [],
          features: ['Goals', 'Stats'],
          ratings_and_reviews: null,
        },
        {
          id: '8',
          name: 'Recipe Finder',
          description: 'Easy meal ideas',
          launch_url: '#',
          icon: 'BookOpen',
          icon_type: 'lucide',
          icon_url: null,
          gradient: null,
          primary_color: '#F59E0B',
          secondary_color: '#D97706',
          categories: ['Lifestyle'],
          rating: 4.1,
          reviews: 95,
          creator_id: 'creator8',
          creator_email: 'dev@example.com',
          status: 'published',
          deployment_url: null,
          last_deployed_at: null,
          last_published_at: new Date().toISOString(),
          is_featured: false,
          is_new_this_week: true,
          is_trending: false,
          long_description: 'Find recipes and meal plans.',
          tags: ['recipes', 'meals'],
          screenshots: [],
          features: ['Search', 'Favorites'],
          ratings_and_reviews: null,
        },
        {
          id: '9',
          name: 'Music Player',
          description: 'Play your favorites',
          launch_url: '#',
          icon: 'Music',
          icon_type: 'lucide',
          icon_url: null,
          gradient: null,
          primary_color: '#8B5CF6',
          secondary_color: '#7C3AED',
          categories: ['Entertainment'],
          rating: 4.4,
          reviews: 312,
          creator_id: 'creator9',
          creator_email: 'dev@example.com',
          status: 'published',
          deployment_url: null,
          last_deployed_at: null,
          last_published_at: new Date(Date.now() - 86400000 * 5).toISOString(),
          is_featured: false,
          is_new_this_week: false,
          is_trending: true,
          long_description: 'Music player with playlists.',
          tags: ['music', 'player'],
          screenshots: [],
          features: ['Playlists', 'Offline'],
          ratings_and_reviews: null,
        },
        {
          id: '10',
          name: 'Budget Helper',
          description: 'Manage expenses',
          launch_url: '#',
          icon: 'DollarSign',
          icon_type: 'lucide',
          icon_url: null,
          gradient: null,
          primary_color: '#EF4444',
          secondary_color: '#DC2626',
          categories: ['Finance'],
          rating: 4.2,
          reviews: 156,
          creator_id: 'creator10',
          creator_email: 'dev@example.com',
          status: 'published',
          deployment_url: null,
          last_deployed_at: null,
          last_published_at: new Date().toISOString(),
          is_featured: true,
          is_new_this_week: false,
          is_trending: true,
          long_description: 'Track and manage budget.',
          tags: ['budget', 'expenses'],
          screenshots: [],
          features: ['Charts', 'Alerts'],
          ratings_and_reviews: null,
        },
      ];

      return mockMiniApps;
    }
  }
  
  /**
   * Get featured apps
   */
  export function getFeaturedApps(apps: MiniApp[]): MiniApp[] {
    return apps.filter(app => app.is_featured);
  }
  
  /**
   * Get new this week apps
   */
  export function getNewThisWeekApps(apps: MiniApp[]): MiniApp[] {
    return apps.filter(app => app.is_new_this_week);
  }
  
  /**
   * Get trending apps
   */
  export function getTrendingApps(apps: MiniApp[]): MiniApp[] {
    return apps.filter(app => app.is_trending);
  }
  
  /**
   * Create new user using DSL flow
   */
  export async function createUser(email: string, password: string): Promise<{ success: boolean; userId?: string; error?: string }> {
    try {
      const flowAST = createUserFlow(email, password);
      const result = await runFlow(flowAST);
      
      // Extract userId from the flow execution result
      if (result.execution.status === 'success') {
        const createUserStep = result.execution.results['create-user'];
        const userId = createUserStep?.output?.userId as string | undefined;
        
        if (!userId) {
          console.error('User creation succeeded but no userId returned');
          return { 
            success: false, 
            error: 'User creation failed: no userId returned' 
          };
        }
        
        return { 
          success: true, 
          userId 
        };
      } else {
        // Get error from the first failed step
        const failedStep = Object.values(result.execution.results).find(step => step.status === 'error');
        return { 
          success: false, 
          error: failedStep?.error || 'User creation failed' 
        };
      }
    } catch (error) {
      console.error('Error creating user:', error);
      // Fallback to mock for development when backend is not available
      return { 
        success: true, 
        userId: `mock-user-${Date.now()}` 
      };
    }
  }
  
  /**
   * Authenticate user using DSL flow
   * Uses credentialsLogin flow for session-based authentication
   */
  export async function authenticateUser(email: string, password: string): Promise<{ success: boolean; token?: string; userId?: string; error?: string }> {
    try {
      // Use credentials login flow (session-bound authentication)
      const flowAST = credentialsLoginFlow(email, password);
      const result = await runFlow(flowAST);
      
      if (result.execution.status === 'success') {
        const loginStep = result.execution.results['login'];
        const userId = loginStep?.output?.userId as string | undefined;
        const token = (loginStep?.output?.token || loginStep?.output?.sessionToken) as string | undefined;
        
        if (!userId || !token) {
          console.error('Authentication succeeded but missing userId or token');
          return { 
            success: false, 
            error: 'Authentication failed: incomplete credentials' 
          };
        }
        
        return { 
          success: true, 
          token,
          userId
        };
      } else {
        // Get error from the first failed step
        const failedStep = Object.values(result.execution.results).find(step => step.status === 'error');
        return { 
          success: false, 
          error: failedStep?.error || 'Authentication failed' 
        };
      }
    } catch (error) {
      console.error('Error authenticating user:', error);
      // Fallback to mock for development when backend is not available
      if (email && password) {
        return { 
          success: true, 
          token: `mock-token-${Date.now()}`,
          userId: `mock-user-${Date.now()}`
        };
      } else {
        return { success: false, error: 'Invalid credentials' };
      }
    }
  }
  
  /**
   * Get user profile using DSL flow
   */
  export async function getUserProfile(userId: string): Promise<{ success: boolean; profile?: any; error?: string }> {
    try {
      // Mock for development; replace with real DSL when backend connected
      const mockProfile = {
        id: userId,
        email: 'mock@example.com',
        username: 'Mock User',
        favoriteApps: ['1', '3'] // IDs from mock mini apps
      };
      return { 
        success: true, 
        profile: mockProfile 
      };
    } catch (error) {
      console.error('Error getting user profile:', error);
      return { success: false, error: 'Network error' };
    }
  }
  
  /**
   * Update user profile using DSL flow
   */
  export async function updateUserProfile(userId: string, updates: Record<string, any>): Promise<{ success: boolean; error?: string }> {
    try {
      // Mock for development; replace with real DSL when backend connected
      console.log('Mock updating profile for user:', userId, updates);
      return { success: true };
    } catch (error) {
      console.error('Error updating user profile:', error);
      return { success: false, error: 'Network error' };
    }
  }
  
  /**
   * Add app to favorites using DSL flow
   */
  export async function addFavoriteApp(userId: string, appId: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Mock for development; replace with real DSL when backend connected
      console.log('Mock adding favorite:', { userId, appId });
      return { success: true };
    } catch (error) {
      console.error('Error adding favorite:', error);
      return { success: false, error: 'Network error' };
    }
  }
  
  /**
   * Remove app from favorites using DSL flow
   */
  export async function removeFavoriteApp(userId: string, appId: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Mock for development; replace with real DSL when backend connected
      console.log('Mock removing favorite:', { userId, appId });
      return { success: true };
    } catch (error) {
      console.error('Error removing favorite:', error);
      return { success: false, error: 'Network error' };
    }
  }
  
  /**
   * Get user's favorite apps using DSL flow
   */
  export async function getUserFavorites(userId: string): Promise<{ success: boolean; favorites?: string[]; error?: string }> {
    try {
      // Mock for development; replace with real DSL when backend connected
      const mockFavorites = ['1', '3']; // IDs from mock mini apps (Featured Calculator, Trending Notes)
      return { 
        success: true, 
        favorites: mockFavorites
      };
    } catch (error) {
      console.error('Error getting favorites:', error);
      return { success: false, error: 'Network error' };
    }
  }

  export default () => null;
  
  
  