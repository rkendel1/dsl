/**
 * @file API Service
 * @description Handles all API calls to StackLive backend using direct HTTP requests
 * Note: React Native doesn't work well with runFlow, so we use fetch instead
 */
import { API_CONFIG, apiRequest } from '../config/api';
import { MiniApp } from '../types';

/**
 * Fetch mini apps list using direct API call
 * Uses fetch instead of runFlow for React Native compatibility
 */
  export async function fetchMiniApps(): Promise<MiniApp[]> {
    try {
      const result = await apiRequest<{ apps: MiniApp[] }>(
        API_CONFIG.ENDPOINTS.MINIAPPS_LIST,
        { method: 'GET' }
      );
      
      if (result.success && result.data?.apps) {
        return result.data.apps;
      }
      
      console.error('Failed to fetch mini apps:', result.error);
      return [];
    } catch (error) {
      console.error('Error fetching mini apps:', error);
      return [];
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
   * Create new user using direct API call
   * Calls auth.userSignUp endpoint directly instead of using DSL runFlow
   */
  export async function createUser(email: string, password: string): Promise<{ success: boolean; userId?: string; error?: string }> {
    try {
      const result = await apiRequest<{ userId: string; supabaseUserId?: string }>(
        API_CONFIG.ENDPOINTS.AUTH_USER_SIGNUP,
        {
          method: 'POST',
          body: JSON.stringify({ email, password }),
        }
      );
      
      if (result.success && result.data) {
        return {
          success: true,
          userId: result.data.userId || result.data.supabaseUserId,
        };
      }
      
      return {
        success: false,
        error: result.error || 'User creation failed',
      };
    } catch (error) {
      console.error('Error creating user:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'User creation failed',
      };
    }
  }
  
  /**
   * Authenticate user using direct API call
   * Calls auth.authenticate endpoint directly instead of using DSL runFlow
   */
  export async function authenticateUser(email: string, password: string): Promise<{ success: boolean; token?: string; userId?: string; error?: string }> {
    try {
      const result = await apiRequest<{ userId: string; token?: string }>(
        API_CONFIG.ENDPOINTS.AUTH_LOGIN,
        {
          method: 'POST',
          body: JSON.stringify({ email, password, actorType: 'user' }),
        }
      );
      
      if (result.success && result.data) {
        const userId = result.data.userId;
        // Generate a session token if not provided by backend
        const token = result.data.token || `token-${userId}-${Date.now()}`;
        
        return {
          success: true,
          token,
          userId,
        };
      }
      
      return {
        success: false,
        error: result.error || 'Authentication failed',
      };
    } catch (error) {
      console.error('Error authenticating user:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Authentication failed',
      };
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
  
  
  