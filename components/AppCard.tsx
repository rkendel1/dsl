/**
 * @file App Card Component
 * @description Reusable app card for different layouts
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MiniApp } from '../../dsl/app/types';

interface AppCardProps {
  app: MiniApp;
  onPress: () => void;
  variant?: 'featured' | 'grid' | 'list';
}

export default function AppCard({ app, onPress, variant = 'grid' }: AppCardProps) {
  const getGradientColors = () => {
    if (app.gradient) {
      // Parse gradient string
      const match = app.gradient.match(/#[0-9A-Fa-f]{6}/g);
      if (match && match.length >= 2) {
        return match;
      }
    }
    return app.primary_color && app.secondary_color
      ? [app.primary_color, app.secondary_color]
      : ['#6366F1', '#8B5CF6'];
  };

  if (variant === 'featured') {
    return (
      <TouchableOpacity style={styles.featuredCard} onPress={onPress}>
        <LinearGradient
          colors={getGradientColors()}
          style={styles.featuredGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {app.icon_url && (
            <Image source={{ uri: app.icon_url }} style={styles.featuredIcon} />
          )}
          <Text style={styles.featuredName}>{app.name}</Text>
          <Text style={styles.featuredDescription} numberOfLines={2}>
            {app.description}
          </Text>
          <View style={styles.featuredButton}>
            <Text style={styles.featuredButtonText}>Open</Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  if (variant === 'list') {
    return (
      <TouchableOpacity style={styles.listCard} onPress={onPress}>
        <View style={styles.listIconContainer}>
          {app.icon_url ? (
            <Image source={{ uri: app.icon_url }} style={styles.listIcon} />
          ) : (
            <LinearGradient
              colors={getGradientColors()}
              style={styles.listIconGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.listIconText}>{app.name.charAt(0)}</Text>
            </LinearGradient>
          )}
        </View>
        <View style={styles.listContent}>
          <Text style={styles.listName}>{app.name}</Text>
          <Text style={styles.listDescription} numberOfLines={1}>
            {app.description}
          </Text>
          {app.categories.length > 0 && (
            <Text style={styles.listCategory}>{app.categories[0]}</Text>
          )}
        </View>
        <View style={styles.listButton}>
          <Text style={styles.listButtonText}>Open</Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={styles.gridCard} onPress={onPress}>
      <View style={styles.gridIconContainer}>
        {app.icon_url ? (
          <Image source={{ uri: app.icon_url }} style={styles.gridIcon} />
        ) : (
          <LinearGradient
            colors={getGradientColors()}
            style={styles.gridIconGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.gridIconText}>{app.name.charAt(0)}</Text>
          </LinearGradient>
        )}
      </View>
      <Text style={styles.gridName} numberOfLines={1}>
        {app.name}
      </Text>
      {app.categories.length > 0 && (
        <Text style={styles.gridCategory} numberOfLines={1}>
          {app.categories[0]}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  // Featured Card Styles
  featuredCard: {
    width: 320,
    height: 200,
    borderRadius: 16,
    marginRight: 16,
    overflow: 'hidden',
  },
  featuredGradient: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featuredIcon: {
    width: 60,
    height: 60,
    borderRadius: 12,
    marginBottom: 12,
  },
  featuredName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  featuredDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 16,
  },
  featuredButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 20,
  },
  featuredButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },

  // Grid Card Styles
  gridCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  gridIconContainer: {
    marginBottom: 12,
  },
  gridIcon: {
    width: 60,
    height: 60,
    borderRadius: 12,
  },
  gridIconGradient: {
    width: 60,
    height: 60,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridIconText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  gridName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 4,
  },
  gridCategory: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
  },

  // List Card Styles
  listCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  listIconContainer: {
    marginRight: 12,
  },
  listIcon: {
    width: 50,
    height: 50,
    borderRadius: 10,
  },
  listIconGradient: {
    width: 50,
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listIconText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  listContent: {
    flex: 1,
  },
  listName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  listDescription: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 4,
  },
  listCategory: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  listButton: {
    backgroundColor: '#6366F1',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  listButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
