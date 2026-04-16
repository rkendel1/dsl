/**
 * @file Home Screen
 * @description Main home screen showing featured mini apps
 */

import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useApp } from '../contexts/AppContext';
import { MiniApp } from '../types';

export default function HomeScreen() {
  const { featuredApps, loading, error } = useApp();

  const renderApp = ({ item }: { item: MiniApp }) => (
    <TouchableOpacity style={styles.appCard}>
      <Text style={styles.appName}>{item.name}</Text>
      <Text style={styles.appDescription}>{item.description}</Text>
      <Text style={styles.appRating}>⭐ {item.rating}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#6366F1" />
        <Text style={styles.loadingText}>Loading apps...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Featured Apps</Text>
      <FlatList
        data={featuredApps}
        renderItem={renderApp}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    padding: 20,
    paddingTop: 10,
  },
  list: {
    paddingHorizontal: 20,
  },
  appCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  appName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  appDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
    lineHeight: 20,
  },
  appRating: {
    fontSize: 14,
    color: '#F59E0B',
    fontWeight: '500',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#6B7280',
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
    textAlign: 'center',
  },
});