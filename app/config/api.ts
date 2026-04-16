/**
 * @file API Configuration
 * @description Configuration for StackLive backend API
 */

// Backend API configuration
export const API_CONFIG = {
  // Update this with your actual backend URL
  BASE_URL: process.env.EXPO_PUBLIC_API_URL || 'https://api.stacklive.app',
  
  // API endpoints
  ENDPOINTS: {
    // Auth endpoints
    AUTH_SIGNUP: '/api/auth/signup',
    AUTH_LOGIN: '/api/auth/login',
    AUTH_USER_SIGNUP: '/api/auth/user-signup',
    
    // Mini apps endpoints
    MINIAPPS_LIST: '/api/miniapps',
    
    // User endpoints
    USER_PROFILE: '/api/users/profile',
    USER_FAVORITES: '/api/users/favorites',
  },
  
  // Request timeout (ms)
  TIMEOUT: 30000,
};

/**
 * Make an authenticated API request
 */
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ success: boolean; data?: T; error?: string }> {
  try {
    const url = `${API_CONFIG.BASE_URL}${endpoint}`;
    
    const response = await Promise.race([
      fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      }),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Request timeout')), API_CONFIG.TIMEOUT)
      ),
    ]);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: errorData.message || `HTTP ${response.status}: ${response.statusText}`,
      };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('API request error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
}

export default API_CONFIG;
