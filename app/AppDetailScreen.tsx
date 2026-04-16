/**
 * @file App Detail Screen
 * @description Detailed view of a specific app
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as api from './services/api';
import { useAuth } from './contexts/AuthContext';
import { impactAsync, ImpactFeedbackStyle } from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface App {
  id: string;
  name: string;
  developer: string;
  icon: string;
  description: string;
  screenshots: string[];
  features: string[];
  rating: number;
  launch_url: string;
  category: string;
  installed: boolean;
}

export default function AppDetailScreen() {
  const { appId } = useLocalSearchParams<{ appId: string }>();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [app, setApp] = useState<App | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAppDetail = useCallback(async () => {
    try {
      setLoading(true);
      const appsResponse = await api.fetchMiniApps();
      const foundApp = appsResponse.find((a: any) => a.id === appId);
      if (foundApp) {
        const installedStr = await AsyncStorage.getItem('installedApps') || '[]';
        const installedApps = JSON.parse(installedStr);
        const appData: App = {
          id: foundApp.id,
          name: foundApp.name,
          developer: foundApp.creator_email,
          icon: foundApp.icon_url || foundApp.icon,
          description: foundApp.long_description || foundApp.description,
          screenshots: foundApp.screenshots || [],
          features: foundApp.features || [],
          rating: foundApp.rating || 0,
          launch_url: foundApp.launch_url,
          category: foundApp.categories ? foundApp.categories.join(', ') : '',
          installed: installedApps.includes(foundApp.id),
        };
        setApp(appData);
      } else {
        setError('App not found');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [appId]);

  useEffect(() => {
    if (appId) {
      fetchAppDetail();
    }
  }, [appId, fetchAppDetail]);

  const handleInstall = async () => {
    if (!app) return;

    if (!isAuthenticated) {
      Alert.alert('Login Required', 'Please log in to install apps');
      return;
    }

    try {
      await impactAsync(ImpactFeedbackStyle.Medium);
      const installedStr = await AsyncStorage.getItem('installedApps') || '[]';
      let installedApps = JSON.parse(installedStr);
      const isCurrentlyInstalled = installedApps.includes(app.id);
      const newInstalledApps = isCurrentlyInstalled
        ? installedApps.filter((id: string) => id !== app.id)
        : [...installedApps, app.id];
      await AsyncStorage.setItem('installedApps', JSON.stringify(newInstalledApps));
      setApp({ ...app, installed: !isCurrentlyInstalled });
      Alert.alert(
        'Success',
        isCurrentlyInstalled ? 'App uninstalled' : 'App installed successfully'
      );
    } catch {
      Alert.alert('Error', 'Something went wrong');
    }
  };

  const handleLaunch = async () => {
    if (!app) return;

    if (!app.installed) {
      Alert.alert('Not Installed', 'Please install the app first');
      return;
    }

    await impactAsync(ImpactFeedbackStyle.Light);
    router.push({
      pathname: '/AppWebViewScreen',
      params: { 
        appId: app.id, 
        url: app.launch_url,
        name: app.name,
        description: app.description 
      },
    });
  };

  const renderScreenshot = ({ item }: { item: string }) => (
    <Image source={{ uri: item }} style={styles.screenshot} resizeMode="cover" />
  );

  const renderFeature = ({ item }: { item: string }) => (
    <View style={styles.featureItem}>
      <Ionicons name="checkmark-circle" size={20} color="#10B981" />
      <Text style={styles.featureText}>{item}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366F1" />
      </View>
    );
  }

  if (error || !app) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={64} color="#EF4444" />
        <Text style={styles.errorText}>{error || 'App not found'}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchAppDetail}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const stars = Array.from({ length: 5 }, (_, i) => (
    <Ionicons
      key={i}
      name={i < Math.floor(app.rating) ? 'star' : i < app.rating ? 'star-half' : 'star-outline'}
      size={20}
      color="#FBBF24"
    />
  ));

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#6B7280" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>App Details</Text>
      </View>

      {/* App Info */}
      <View style={styles.appInfo}>
        <Image source={{ uri: app.icon }} style={styles.icon} />
        <View style={styles.appDetails}>
          <Text style={styles.appName}>{app.name}</Text>
          <Text style={styles.developer}>By {app.developer}</Text>
          <View style={styles.ratingContainer}>
            <View style={styles.stars}>{stars}</View>
            <Text style={styles.rating}>{app.rating.toFixed(1)}</Text>
          </View>
        </View>
      </View>

      {/* Description */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>{app.description}</Text>
      </View>

      {/* Screenshots */}
      {app.screenshots.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Screenshots</Text>
          <FlatList
            data={app.screenshots}
            renderItem={renderScreenshot}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.screenshotsContainer}
            keyExtractor={(item) => item}
          />
        </View>
      )}

      {/* Features */}
      {app.features.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Features</Text>
          <FlatList
            data={app.features}
            renderItem={renderFeature}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      )}

      {/* Action Buttons */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={[
            styles.actionButton,
            styles.primaryButton,
            app.installed && styles.secondaryButton,
          ]}
          onPress={handleInstall}
        >
          <Ionicons
            name={app.installed ? 'trash-outline' : 'download-outline'}
            size={20}
            color="#FFFFFF"
          />
          <Text style={styles.primaryButtonText}>
            {app.installed ? 'Uninstall' : 'Install'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.secondaryButton]}
          onPress={handleLaunch}
          disabled={!app.launch_url}
        >
          <Ionicons name="play-circle" size={20} color="#6366F1" />
          <Text style={styles.secondaryButtonText}>Launch App</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 16,
  },
  appInfo: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  icon: {
    width: 80,
    height: 80,
    borderRadius: 16,
    marginRight: 16,
  },
  appDetails: {
    flex: 1,
    justifyContent: 'space-between',
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  developer: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stars: {
    flexDirection: 'row',
    marginRight: 8,
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  section: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#4B5563',
    lineHeight: 24,
  },
  screenshotsContainer: {
    paddingVertical: 8,
  },
  screenshot: {
    width: 200,
    height: 400,
    borderRadius: 12,
    marginRight: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureText: {
    fontSize: 16,
    color: '#4B5563',
    marginLeft: 8,
  },
  actions: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    marginHorizontal: 4,
  },
  primaryButton: {
    backgroundColor: '#6366F1',
  },
  secondaryButton: {
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  secondaryButtonText: {
    color: '#6366F1',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F9FAFB',
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#6366F1',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});