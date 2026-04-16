/**
 * @file API Service
 * @description Handles all API calls to StackLive backend using @stacklive/sdk DSL flows
 * This is a REFERENCE IMPLEMENTATION showing how to use the DSL in React Native
 */
import { runFlow, flow, list } from '@stacklive/sdk';
import {
  userSignUpFlow,
  userLoginFlow,
} from '../flows';
import { MiniApp } from '../types';

/**
 * Fetch mini apps list using DSL flow
 * Following the recommended pattern from SDK examples
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
   * Create new user using DSL flow
   * Uses auth.userSignUp for end-user self-registration
   */
  export async function createUser(email: string, password: string): Promise<{ success: boolean; userId?: string; error?: string }> {
    try {
      const flowAST = userSignUpFlow(email, password);
      const result = await runFlow(flowAST);
      
      // Extract userId from the flow execution result
      if (result.execution.status === 'success') {
        const signupStep = result.execution.results['signup'];
        const userId = signupStep?.output?.userId as string | undefined;
        const supabaseUserId = signupStep?.output?.supabaseUserId as string | undefined;
        
        if (!userId && !supabaseUserId) {
          console.error('User creation succeeded but no userId returned');
          return { 
            success: false, 
            error: 'User creation failed: no userId returned' 
          };
        }
        
        return { 
          success: true, 
          userId: userId || supabaseUserId
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
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'User creation failed'
      };
    }
  }
  
  /**
   * Authenticate user using DSL flow
   * Uses auth.authenticate for simple authentication without session binding
   */
  export async function authenticateUser(email: string, password: string): Promise<{ success: boolean; token?: string; userId?: string; error?: string }> {
    try {
      // Use simple authentication flow
      const flowAST = userLoginFlow(email, password);
      const result = await runFlow(flowAST);
      
      if (result.execution.status === 'success') {
        const loginStep = result.execution.results['login'];
        const userId = loginStep?.output?.userId as string | undefined;
        
        if (!userId) {
          console.error('Authentication succeeded but missing userId');
          return { 
            success: false, 
            error: 'Authentication failed: incomplete credentials' 
          };
        }
        
        // Generate a simple token for this session
        // In production, this would come from the backend
        const token = `token-${userId}-${Date.now()}`;
        
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
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Authentication failed'
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
  
  
  