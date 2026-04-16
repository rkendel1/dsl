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
    await ExpoSplashScreen.hideAsync();

    try {
      const firstLaunch = await AsyncStorage.getItem('firstLaunch') !== 'false';
      if (firstLaunch) {
        // @ts-ignore - Expo Router type doesn't include group paths, but runtime works
        router.replace({ pathname: '/OnboardingScreen' });
        await AsyncStorage.setItem('firstLaunch', 'false');
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
