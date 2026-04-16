/**
 * @file Home Screen
 * @description Main home screen showing featured mini apps
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

interface MiniApp {
  id: string;
  name: string;
  description: string;
  rating: number;
}

const mockApps: MiniApp[] = [
  {
    id: '1',
    name: 'Featured Calculator',
    description: 'A simple calculator app',
    rating: 4.8,
  },
  {
    id: '2',
    name: 'New Weather App',
    description: 'Check the weather anywhere',
    rating: 4.2,
  },
  {
    id: '3',
    name: 'Trending Notes',
    description: 'Take notes on the go',
    rating: 4.9,
  },
  {
    id: '4',
    name: 'Todo List',
    description: 'Manage your tasks',
    rating: 4.5,
  },
];

export default function HomeScreen() {
  const [apps, setApps] = useState<MiniApp[]>([]);

  useEffect(() => {
    setApps(mockApps);
  }, []);

  const renderApp = ({ item }: { item: MiniApp }) => (
    <TouchableOpacity style={styles.appCard}>
      <Text style={styles.appName}>{item.name}</Text>
      <Text style={styles.appDescription}>{item.description}</Text>
      <Text style={styles.appRating}>⭐ {item.rating}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Featured Apps</Text>
      <FlatList
        data={apps}
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
});