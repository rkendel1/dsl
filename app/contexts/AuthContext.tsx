/**
 * @file Auth Context
 * @description Authentication state management using DSL flows
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authenticateUser, createUser, getUserProfile } from '../services/api';
import { getUserToken, saveUserToken, removeUserToken, saveUserId, getUserId, removeUserId } from '../services/storage';

interface UserProfile {
  id: string;
  email?: string;
  username?: string;
  favoriteApps?: string[];
}

interface AuthContextType {
  isAuthenticated: boolean;
  userToken: string | null;
  userId: string | null;
  userProfile: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userToken, setUserToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const loadAuthState = React.useCallback(async () => {
    try {
      const token = await getUserToken();
      const id = await getUserId();
      setUserToken(token);
      setUserId(id);

      // Load user profile if we have a userId
      if (id) {
        await loadUserProfile(id);
      }
    } catch (error) {
      console.error('Error loading auth state:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAuthState();
  }, [loadAuthState]);

  const loadUserProfile = async (id: string) => {
    try {
      const result = await getUserProfile(id);
      if (result.success && result.profile) {
        setUserProfile(result.profile);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const refreshProfile = async () => {
    if (userId) {
      await loadUserProfile(userId);
    }
  };

  const login = async (email: string, password: string) => {
    const result = await authenticateUser(email, password);
    if (result.success && result.token && result.userId) {
      await saveUserToken(result.token);
      await saveUserId(result.userId);
      setUserToken(result.token);
      setUserId(result.userId);
      
      // Load user profile
      await loadUserProfile(result.userId);
    }
    return result;
  };

  const signup = async (email: string, password: string) => {
    const result = await createUser(email, password);
    if (result.success && result.userId) {
      // After signup, automatically log in
      const loginResult = await authenticateUser(email, password);
      if (loginResult.success && loginResult.token && loginResult.userId) {
        await saveUserToken(loginResult.token);
        await saveUserId(loginResult.userId);
        setUserToken(loginResult.token);
        setUserId(loginResult.userId);
        
        // Load user profile
        await loadUserProfile(loginResult.userId);
        return { success: true };
      }
      return loginResult;
    }
    return { success: false, error: result.error };
  };

  const logout = async () => {
    await removeUserToken();
    await removeUserId();
    setUserToken(null);
    setUserId(null);
    setUserProfile(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!userToken && !!userId,
        userToken,
        userId,
        userProfile,
        loading,
        login,
        signup,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

export default () => null;
