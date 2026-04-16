/**
 * @file Home Screen
 * @description Main home screen with featured carousel and app sections
 */

import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  FlatList,
  Dimensions,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useApp } from '../contexts/AppContext';
import AppCard from '../../components/AppCard';
import { MiniApp } from '../types';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const { featuredApps, newThisWeekApps, loading, refreshApps } = useApp();
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleAppPress = (app: MiniApp) => {
    // Navigate to app detail screen
    router.push({
      pathname: '/AppDetailScreen',
      params: { appId: app.id }
    });
  };

  const handleSeeAll = (section: string) => {
    router.push('/TrendingScreen');
  };

  const handleProfilePress = () => {
    router.push('/ProfileScreen');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Home</Text>
        <TouchableOpacity onPress={handleProfilePress} style={styles.profileButton}>
          <Text style={styles.profileIcon}>👤</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search home..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#9CA3AF"
        />
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refreshApps} />
        }
      >
        {/* Featured Section */}
        {featuredApps.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Featured</Text>
              <TouchableOpacity onPress={() => handleSeeAll('featured')}>
                <Text style={styles.seeAll}>See all</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              horizontal
              data={featuredApps}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <AppCard app={item} onPress={() => handleAppPress(item)} variant="featured" />
              )}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.featuredList}
            />
            {/* Pagination dots */}
            <View style={styles.pagination}>
              {featuredApps.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.dot,
                    index === 0 && styles.dotActive,
                  ]}
                />
              ))}
            </View>
          </View>
        )}

        {/* New This Week Section */}
        {newThisWeekApps.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>New This Week</Text>
              <TouchableOpacity onPress={() => handleSeeAll('new')}>
                <Text style={styles.seeAll}>See all</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.gridContainer}>
              {newThisWeekApps.slice(0, 4).map((app) => (
                <AppCard
                  key={app.id}
                  app={app}
                  onPress={() => handleAppPress(app)}
                  variant="list"
                />
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileIcon: {
    fontSize: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1F2937',
  },
  content: {
    flex: 1,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  seeAll: {
    fontSize: 16,
    color: '#6366F1',
    fontWeight: '600',
  },
  featuredList: {
    paddingHorizontal: 20,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D1D5DB',
    marginHorizontal: 4,
  },
  dotActive: {
    backgroundColor: '#6366F1',
    width: 16,
  },
  gridContainer: {
    paddingHorizontal: 20,
  },
});
