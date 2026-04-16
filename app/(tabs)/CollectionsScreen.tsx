/**
 * @file Collections Screen
 * @description Shows app collections/categories
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const CATEGORIES = [
  { name: 'Entertainment', emoji: '🎮', gradient: ['#FF6B6B', '#FFE66D'] },
  { name: 'Productivity', emoji: '📝', gradient: ['#4ECDC4', '#44A08D'] },
  { name: 'Health & Fitness', emoji: '💪', gradient: ['#FF6B6B', '#C06C84'] },
  { name: 'Finance', emoji: '💰', gradient: ['#3B82F6', '#8B5CF6'] },
  { name: 'Utilities', emoji: '🔧', gradient: ['#F59E0B', '#EF4444'] },
  { name: 'Games', emoji: '🎯', gradient: ['#EC4899', '#8B5CF6'] },
];

export default function CollectionsScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Collections</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {CATEGORIES.map((category, index) => (
          <TouchableOpacity key={index} style={styles.card}>
            <LinearGradient
              colors={category.gradient}
              style={styles.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.emoji}>{category.emoji}</Text>
              <Text style={styles.categoryName}>{category.name}</Text>
            </LinearGradient>
          </TouchableOpacity>
        ))}
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
  content: {
    padding: 20,
  },
  card: {
    height: 120,
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
  },
  gradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  emoji: {
    fontSize: 48,
    marginRight: 20,
  },
  categoryName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
