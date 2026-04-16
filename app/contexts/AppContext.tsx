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

const mockApps: MiniApp[] = [
  {
    id: '1',
    name: 'Chat Mini',
    icon: '../../assets/images/react-logo.png',
    description: 'Quick messaging for teams',
    launch_url: '#',
    icon_type: 'url',
    icon_url: null,
    gradient: null,
    primary_color: null,
    secondary_color: null,
    categories: ['Communication'],
    rating: 4.5,
    reviews: 120,
    creator_id: 'creator1',
    creator_email: 'dev@example.com',
    status: 'active',
    deployment_url: null,
    last_deployed_at: null,
    last_published_at: new Date(Date.now() - 86400000).toISOString(),
    is_featured: true,
    is_new_this_week: false,
    is_trending: false,
    long_description: null,
    tags: ['chat', 'team'],
    screenshots: [],
    features: ['Real-time', 'Groups'],
    ratings_and_reviews: null,
  },
  {
    id: '2',
    name: 'Calculator Pro',
    icon: '../../assets/images/icon.png',
    description: 'Advanced math tools',
    launch_url: '#',
    icon_type: 'url',
    icon_url: null,
    gradient: null,
    primary_color: null,
    secondary_color: null,
    categories: ['Tools'],
    rating: 4.2,
    reviews: 89,
    creator_id: 'creator2',
    creator_email: 'dev@example.com',
    status: 'active',
    deployment_url: null,
    last_deployed_at: null,
    last_published_at: new Date().toISOString(),
    is_featured: false,
    is_new_this_week: true,
    is_trending: false,
    long_description: null,
    tags: ['math', 'calc'],
    screenshots: [],
    features: ['Scientific', 'History'],
    ratings_and_reviews: null,
  },
  {
    id: '3',
    name: 'Weather Now',
    icon: '../../assets/images/react-logo@2x.png',
    description: 'Real-time forecasts',
    launch_url: '#',
    icon_type: 'url',
    icon_url: null,
    gradient: null,
    primary_color: null,
    secondary_color: null,
    categories: ['Weather'],
    rating: 4.7,
    reviews: 203,
    creator_id: 'creator3',
    creator_email: 'dev@example.com',
    status: 'active',
    deployment_url: null,
    last_deployed_at: null,
    last_published_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    is_featured: true,
    is_new_this_week: false,
    is_trending: false,
    long_description: null,
    tags: ['weather', 'forecast'],
    screenshots: [],
    features: ['Alerts', 'Maps'],
    ratings_and_reviews: null,
  },
  {
    id: '4',
    name: 'Note Taker',
    icon: '../../assets/images/react-logo.png',
    description: 'Simple note organization',
    launch_url: '#',
    icon_type: 'url',
    icon_url: null,
    gradient: null,
    primary_color: null,
    secondary_color: null,
    categories: ['Productivity'],
    rating: 4.0,
    reviews: 67,
    creator_id: 'creator4',
    creator_email: 'dev@example.com',
    status: 'active',
    deployment_url: null,
    last_deployed_at: null,
    last_published_at: new Date().toISOString(),
    is_featured: false,
    is_new_this_week: true,
    is_trending: false,
    long_description: null,
    tags: ['notes', 'organize'],
    screenshots: [],
    features: ['Sync', 'Search'],
    ratings_and_reviews: null,
  },
  {
    id: '5',
    name: 'Game Hub',
    icon: '../../assets/images/react-logo.png',
    description: 'Mini games collection',
    launch_url: '#',
    icon_type: 'url',
    icon_url: null,
    gradient: null,
    primary_color: null,
    secondary_color: null,
    categories: ['Games'],
    rating: 4.8,
    reviews: 456,
    creator_id: 'creator5',
    creator_email: 'dev@example.com',
    status: 'active',
    deployment_url: null,
    last_deployed_at: null,
    last_published_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    is_featured: false,
    is_new_this_week: false,
    is_trending: true,
    long_description: null,
    tags: ['games', 'fun'],
    screenshots: [],
    features: ['Multiplayer', 'Puzzles'],
    ratings_and_reviews: null,
  },
  {
    id: '6',
    name: 'Todo List',
    icon: '../../assets/images/icon.png',
    description: 'Task management app',
    launch_url: '#',
    icon_type: 'url',
    icon_url: null,
    gradient: null,
    primary_color: null,
    secondary_color: null,
    categories: ['Productivity'],
    rating: 4.3,
    reviews: 134,
    creator_id: 'creator6',
    creator_email: 'dev@example.com',
    status: 'active',
    deployment_url: null,
    last_deployed_at: null,
    last_published_at: new Date().toISOString(),
    is_featured: false,
    is_new_this_week: true,
    is_trending: false,
    long_description: null,
    tags: ['todo', 'tasks'],
    screenshots: [],
    features: ['Reminders', 'Lists'],
    ratings_and_reviews: null,
  },
  {
    id: '7',
    name: 'Fitness Tracker',
    icon: '../../assets/images/react-logo@2x.png',
    description: 'Track your workouts',
    launch_url: '#',
    icon_type: 'url',
    icon_url: null,
    gradient: null,
    primary_color: null,
    secondary_color: null,
    categories: ['Health'],
    rating: 4.6,
    reviews: 278,
    creator_id: 'creator7',
    creator_email: 'dev@example.com',
    status: 'active',
    deployment_url: null,
    last_deployed_at: null,
    last_published_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    is_featured: false,
    is_new_this_week: true,
    is_trending: false,
    long_description: null,
    tags: ['fitness', 'track'],
    screenshots: [],
    features: ['Goals', 'Stats'],
    ratings_and_reviews: null,
  },
  {
    id: '8',
    name: 'Recipe Finder',
    icon: '../../assets/images/react-logo.png',
    description: 'Easy meal ideas',
    launch_url: '#',
    icon_type: 'url',
    icon_url: null,
    gradient: null,
    primary_color: null,
    secondary_color: null,
    categories: ['Lifestyle'],
    rating: 4.1,
    reviews: 95,
    creator_id: 'creator8',
    creator_email: 'dev@example.com',
    status: 'active',
    deployment_url: null,
    last_deployed_at: null,
    last_published_at: new Date().toISOString(),
    is_featured: false,
    is_new_this_week: true,
    is_trending: false,
    long_description: null,
    tags: ['recipes', 'meals'],
    screenshots: [],
    features: ['Search', 'Favorites'],
    ratings_and_reviews: null,
  },
  {
    id: '9',
    name: 'Music Player',
    icon: '../../assets/images/react-logo.png',
    description: 'Play your favorites',
    launch_url: '#',
    icon_type: 'url',
    icon_url: null,
    gradient: null,
    primary_color: null,
    secondary_color: null,
    categories: ['Entertainment'],
    rating: 4.4,
    reviews: 312,
    creator_id: 'creator9',
    creator_email: 'dev@example.com',
    status: 'active',
    deployment_url: null,
    last_deployed_at: null,
    last_published_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    is_featured: false,
    is_new_this_week: false,
    is_trending: true,
    long_description: null,
    tags: ['music', 'player'],
    screenshots: [],
    features: ['Playlists', 'Offline'],
    ratings_and_reviews: null,
  },
  {
    id: '10',
    name: 'Budget Helper',
    icon: '../../assets/images/icon.png',
    description: 'Manage expenses',
    launch_url: '#',
    icon_type: 'url',
    icon_url: null,
    gradient: null,
    primary_color: null,
    secondary_color: null,
    categories: ['Finance'],
    rating: 4.2,
    reviews: 156,
    creator_id: 'creator10',
    creator_email: 'dev@example.com',
    status: 'active',
    deployment_url: null,
    last_deployed_at: null,
    last_published_at: new Date().toISOString(),
    is_featured: true,
    is_new_this_week: false,
    is_trending: true,
    long_description: null,
    tags: ['budget', 'expenses'],
    screenshots: [],
    features: ['Charts', 'Alerts'],
    ratings_and_reviews: null,
  },
];

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

  const loadApps = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedApps = await fetchMiniApps();
      setApps(fetchedApps.length > 0 ? fetchedApps : mockApps);
      
      // Load user favorites from DSL if authenticated
      if (userId && isAuthenticated) {
        await loadFavorites();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load apps');
      setApps(mockApps);
      console.error('Error loading apps:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadFavorites = async () => {
    if (!userId) return;
    
    try {
      const result = await getUserFavorites(userId);
      if (result.success && result.favorites) {
        setFavorites(result.favorites);
      }
    } catch (err) {
      console.error('Error loading favorites:', err);
    }
  };

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
  }, []);

  // Reload favorites when user logs in/out
  useEffect(() => {
    if (userId && isAuthenticated) {
      loadFavorites();
    } else {
      setFavorites([]);
    }
  }, [userId, isAuthenticated]);

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