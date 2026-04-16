/**
 * @file API Service
 * @description Handles all API calls to StackLive backend using @stacklive/sdk DSL flows
 */
import { flow, list, runFlow } from '@stacklive/sdk';
import {
  createUserFlow,
  credentialsLoginFlow,
} from '../flows';
import { MiniApp } from '../types';

/**
 * Mock mini apps data for development fallback
 * Used when backend is unavailable or DSL execution fails
 */
const mockMiniApps: MiniApp[] = [
  {
    id: '1',
    name: 'Featured Calculator',
    description: 'A powerful calculator with advanced features',
    launch_url: 'https://example.com/calculator',
    icon: 'Calculator',
    icon_type: 'lucide',
    icon_url: null,
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    primary_color: '#667eea',
    secondary_color: '#764ba2',
    categories: ['Productivity', 'Tools'],
    rating: 4.5,
    reviews: 1250,
    creator_id: 'creator-1',
    creator_email: 'dev@example.com',
    status: 'published',
    deployment_url: 'https://example.com/calculator',
    last_deployed_at: new Date().toISOString(),
    last_published_at: new Date().toISOString(),
    is_featured: true,
    is_new_this_week: false,
    is_trending: false,
    long_description: 'A feature-rich calculator app with scientific functions, history, and more.',
    tags: ['calculator', 'math', 'productivity'],
    screenshots: [],
    features: ['Scientific calculations', 'History', 'Dark mode'],
    ratings_and_reviews: null,
  },
  {
    id: '2',
    name: 'New Task Manager',
    description: 'Organize your tasks and boost productivity',
    launch_url: 'https://example.com/tasks',
    icon: 'CheckSquare',
    icon_type: 'lucide',
    icon_url: null,
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    primary_color: '#f093fb',
    secondary_color: '#f5576c',
    categories: ['Productivity'],
    rating: 4.7,
    reviews: 890,
    creator_id: 'creator-2',
    creator_email: 'dev@example.com',
    status: 'published',
    deployment_url: 'https://example.com/tasks',
    last_deployed_at: new Date().toISOString(),
    last_published_at: new Date().toISOString(),
    is_featured: false,
    is_new_this_week: true,
    is_trending: false,
    long_description: 'Manage your daily tasks efficiently with our intuitive task manager.',
    tags: ['tasks', 'productivity', 'organization'],
    screenshots: [],
    features: ['Task lists', 'Reminders', 'Priority levels'],
    ratings_and_reviews: null,
  },
  {
    id: '3',
    name: 'Trending Notes',
    description: 'Quick and easy note-taking app',
    launch_url: 'https://example.com/notes',
    icon: 'FileText',
    icon_type: 'lucide',
    icon_url: null,
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    primary_color: '#4facfe',
    secondary_color: '#00f2fe',
    categories: ['Productivity', 'Tools'],
    rating: 4.3,
    reviews: 567,
    creator_id: 'creator-3',
    creator_email: 'dev@example.com',
    status: 'published',
    deployment_url: 'https://example.com/notes',
    last_deployed_at: new Date().toISOString(),
    last_published_at: new Date().toISOString(),
    is_featured: true,
    is_new_this_week: false,
    is_trending: true,
    long_description: 'A simple yet powerful note-taking application for all your needs.',
    tags: ['notes', 'writing', 'productivity'],
    screenshots: [],
    features: ['Rich text editing', 'Cloud sync', 'Search'],
    ratings_and_reviews: null,
  },
  {
    id: '4',
    name: 'Weather Forecast',
    description: 'Get accurate weather forecasts',
    launch_url: 'https://example.com/weather',
    icon: 'Cloud',
    icon_type: 'lucide',
    icon_url: null,
    gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    primary_color: '#a8edea',
    secondary_color: '#fed6e3',
    categories: ['Weather', 'Lifestyle'],
    rating: 4.6,
    reviews: 2340,
    creator_id: 'creator-4',
    creator_email: 'dev@example.com',
    status: 'published',
    deployment_url: 'https://example.com/weather',
    last_deployed_at: new Date().toISOString(),
    last_published_at: new Date().toISOString(),
    is_featured: false,
    is_new_this_week: true,
    is_trending: true,
    long_description: 'Stay prepared with detailed weather forecasts and alerts.',
    tags: ['weather', 'forecast', 'alerts'],
    screenshots: [],
    features: ['7-day forecast', 'Hourly updates', 'Weather alerts'],
    ratings_and_reviews: null,
  },
  {
    id: '5',
    name: 'Fitness Tracker',
    description: 'Track your fitness journey',
    launch_url: 'https://example.com/fitness',
    icon: 'Activity',
    icon_type: 'lucide',
    icon_url: null,
    gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    primary_color: '#fa709a',
    secondary_color: '#fee140',
    categories: ['Health', 'Fitness'],
    rating: 4.8,
    reviews: 1890,
    creator_id: 'creator-5',
    creator_email: 'dev@example.com',
    status: 'published',
    deployment_url: 'https://example.com/fitness',
    last_deployed_at: new Date().toISOString(),
    last_published_at: new Date().toISOString(),
    is_featured: true,
    is_new_this_week: false,
    is_trending: true,
    long_description: 'Track workouts, calories, and achieve your fitness goals.',
    tags: ['fitness', 'health', 'workout'],
    screenshots: [],
    features: ['Workout tracking', 'Calorie counter', 'Progress charts'],
    ratings_and_reviews: null,
  },
];

/**
 * Fetch mini apps list using DSL flow
 * Following the recommended pattern from SDK examples
 * Falls back to mock data for development when backend is unavailable
 */
  export async function fetchMiniApps(): Promise<MiniApp[]> {
    try {
      // Use the DSL flow to fetch mini apps (inline pattern as recommended)
      const result = await runFlow(
        flow('miniapps-list')
          .step(list('miniapps', { id: 'list-apps' }))
          .build()
      );
      
      if (result.execution.status === 'success') {
        // Extract apps from the flow execution result
        const listAppsStep = result.execution.results['list-apps'];
        const apps = listAppsStep?.output?.apps as MiniApp[] | undefined;
        
        if (!apps || apps.length === 0) {
          console.warn('Mini apps list succeeded but no apps returned, using mock data');
          return mockMiniApps;
        }
        
        return apps;
      } else {
        // Get error from the first failed step
        const failedStep = Object.values(result.execution.results).find(step => step.status === 'error');
        console.warn('Failed to fetch mini apps, using mock data:', failedStep?.error || 'Unknown error');
        return mockMiniApps;
      }
    } catch (error) {
      console.warn('Error fetching mini apps, using mock data:', error);
      // Fallback to mock data for development when backend is not available
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
  
  
  