/**
 * @file App.tsx
 * @description StackLive Native Mobile App - Mini App Store
 */

// Import polyfills FIRST - before any other imports
import './polyfills';

import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './contexts/AuthContext';
import { AppProvider } from './contexts/AppContext';

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AppProvider>
          <StatusBar style="auto" />
        </AppProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
