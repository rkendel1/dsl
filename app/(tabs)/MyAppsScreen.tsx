/**
 * @file My Apps Screen
 * @description Shows user's favorited apps
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useApp } from '../contexts/AppContext';
import AppCard from '../../components/AppCard';
import { MiniApp } from '../types';

export default function MyAppsScreen() {
  const navigation = useNavigation();
  const { myApps, loading, refreshApps } = useApp();

  const handleAppPress = (app: MiniApp) => {
    (navigation.getParent() as any)?.navigate('AppDetail', { app });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Apps</Text>
      </View>

      <FlatList
        data={myApps}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <AppCard app={item} onPress={() => handleAppPress(item)} variant="list" />
        )}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refreshApps} />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>⭐</Text>
            <Text style={styles.emptyTitle}>No Favorites Yet</Text>
            <Text style={styles.emptyText}>
              Star your favorite apps to see them here
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  list: {
    padding: 20,
  },
  empty: {
    padding: 40,
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
  },
});
