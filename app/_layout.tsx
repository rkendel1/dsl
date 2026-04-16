/**
 * @file App.tsx
 * @description StackLive Native Mobile App - Mini App Store
 */

import { Stack, useRouter } from 'expo-router';
import React, { useState, useEffect, useCallback } from 'react';
import * as ExpoSplashScreen from 'expo-splash-screen';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AppProvider } from './contexts/AppContext';
import CustomSplashScreen from './SplashScreen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

function RootLayoutNav() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    ExpoSplashScreen.preventAutoHideAsync();
  }, []);

  const checkAndRoute = useCallback(async () => {
    setChecked(true);
    
    try {
      // Hide splash screen after a small delay to ensure smooth transition
      await new Promise(resolve => setTimeout(resolve, 100));
      try {
        await ExpoSplashScreen.hideAsync();
      } catch (error) {
        // Splash screen may already be hidden, log but continue
        console.log('Splash screen hide error (non-critical):', error);
      }

      const firstLaunch = await AsyncStorage.getItem('firstLaunch') !== 'false';
      if (firstLaunch) {
        // @ts-ignore - Expo Router type doesn't include group paths, but runtime works
        router.replace({ pathname: '/OnboardingScreen' });
      } else if (!isAuthenticated) {
        // @ts-ignore - Expo Router type doesn't include group paths, but runtime works
        router.replace({ pathname: '/AuthScreen' });
      } else {
        // @ts-ignore - Expo Router type doesn't include group paths, but runtime works
        router.replace({ pathname: '/(tabs)' });
      }
    } catch (error) {
      console.error('Error checking first launch:', error);
      // Fallback to tabs
      // @ts-ignore - Expo Router type doesn't include group paths, but runtime works
      router.replace({ pathname: '/(tabs)' });
    }
  }, [router, isAuthenticated]);

  useEffect(() => {
    if (loading) return;
    checkAndRoute();
  }, [loading, checkAndRoute]);
  if (loading || !checked) {
    return <CustomSplashScreen />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="OnboardingScreen" options={{ headerShown: false }} />
      <Stack.Screen name="AuthScreen" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="AppDetailScreen" options={{ presentation: 'modal' }} />
      <Stack.Screen name="AppWebViewScreen" options={{ presentation: 'modal' }} />
    </Stack>
  );
}

export default function Layout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AppProvider>
          <RootLayoutNav />
        </AppProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
