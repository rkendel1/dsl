/**
 * @file App Context
 * @description Global state management for the app using DSL flows
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { MiniApp } from '../types';
import { 
  fetchMiniApps, 
  getFeaturedApps, 
  getNewThisWeekApps, 
  getTrendingApps,
  getUserFavorites,
  addFavoriteApp,
  removeFavoriteApp
} from '../services/api';
import { useAuth } from './AuthContext';

interface AppContextType {
  apps: MiniApp[];
  featuredApps: MiniApp[];
  newThisWeekApps: MiniApp[];
  trendingApps: MiniApp[];
  myApps: MiniApp[];
  favorites: string[];
  loading: boolean;
  error: string | null;
  refreshApps: () => Promise<void>;
  toggleFavorite: (appId: string) => Promise<void>;
  isFavorited: (appId: string) => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const { userId, isAuthenticated } = useAuth();
  const [apps, setApps] = useState<MiniApp[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadFavorites = React.useCallback(async () => {
    if (!userId) return;
    
    try {
      const result = await getUserFavorites(userId);
      if (result.success && result.favorites) {
        setFavorites(result.favorites);
      }
    } catch (err) {
      console.error('Error loading favorites:', err);
    }
  }, [userId]);

  const loadApps = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedApps = await fetchMiniApps();
      setApps(fetchedApps);
      
      // Load user favorites from DSL if authenticated
      if (userId && isAuthenticated) {
        await loadFavorites();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load apps');
      console.error('Error loading apps:', err);
    } finally {
      setLoading(false);
    }
    // loadFavorites is intentionally omitted from dependencies to prevent circular dependency:
    // - loadFavorites depends on userId
    // - loadApps depends on userId, isAuthenticated, and calls loadFavorites (line 357)
    // - Including loadFavorites would cause unnecessary re-renders when loadFavorites changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, isAuthenticated]);

  const toggleFavorite = async (appId: string) => {
    if (!userId || !isAuthenticated) {
      console.warn('User must be logged in to favorite apps');
      return;
    }

    try {
      if (favorites.includes(appId)) {
        // Remove from favorites using DSL
        const result = await removeFavoriteApp(userId, appId);
        if (result.success) {
          setFavorites(prev => prev.filter(id => id !== appId));
        }
      } else {
        // Add to favorites using DSL
        const result = await addFavoriteApp(userId, appId);
        if (result.success) {
          setFavorites(prev => [...prev, appId]);
        }
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
    }
  };

  const isFavorited = (appId: string): boolean => {
    return favorites.includes(appId);
  };

  useEffect(() => {
    loadApps();
  }, [loadApps]);

  // Reload favorites when user logs in/out
  useEffect(() => {
    if (userId && isAuthenticated) {
      loadFavorites();
    } else {
      setFavorites([]);
    }
  }, [userId, isAuthenticated, loadFavorites]);

  const featuredApps = getFeaturedApps(apps);
  const newThisWeekApps = getNewThisWeekApps(apps);
  const trendingApps = getTrendingApps(apps);
  const myApps = apps.filter(app => favorites.includes(app.id));

  return (
    <AppContext.Provider
      value={{
        apps,
        featuredApps,
        newThisWeekApps,
        trendingApps,
        myApps,
        favorites,
        loading,
        error,
        refreshApps: loadApps,
        toggleFavorite,
        isFavorited,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}

export default () => null;