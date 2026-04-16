/**
 * @file Profile Screen
 * @description User profile and settings
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';

export default function ProfileScreen() {
  const navigation = useNavigation();
  const { isAuthenticated, logout, userProfile, userId } = useAuth();

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await logout();
          navigation.navigate('Auth' as never);
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content}>
        {/* Profile Info */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarIcon}>👤</Text>
          </View>
          <Text style={styles.username}>
            {isAuthenticated && userProfile?.username 
              ? userProfile.username 
              : isAuthenticated && userProfile?.email
              ? userProfile.email.split('@')[0]
              : 'Guest'}
          </Text>
          <Text style={styles.userEmail}>
            {isAuthenticated && userProfile?.email ? userProfile.email : 'Not logged in'}
          </Text>
          {userId && (
            <Text style={styles.userId}>ID: {userId.substring(0, 8)}...</Text>
          )}
        </View>

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ACCOUNT</Text>
          {!isAuthenticated && (
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => navigation.navigate('Auth' as never)}
            >
              <Text style={styles.menuIcon}>🔐</Text>
              <Text style={styles.menuText}>Sign In / Create Account</Text>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
          )}
          {isAuthenticated && (
            <>
              <TouchableOpacity style={styles.menuItem}>
                <Text style={styles.menuIcon}>📧</Text>
                <Text style={styles.menuText}>Email</Text>
                <Text style={styles.chevron}>›</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem}>
                <Text style={styles.menuIcon}>🔒</Text>
                <Text style={styles.menuText}>Password</Text>
                <Text style={styles.chevron}>›</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* Memory & Context Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>MEMORY & CONTEXT</Text>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuIcon}>🔄</Text>
            <View style={styles.menuContent}>
              <Text style={styles.menuText}>Share my context between apps</Text>
              <Text style={styles.menuSubtext}>
                Allow apps to access your preferences
              </Text>
            </View>
            <View style={styles.toggle}>
              <View style={styles.toggleInactive} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuIcon}>👁️</Text>
            <Text style={styles.menuText}>View my context data</Text>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Preferences Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PREFERENCES</Text>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuIcon}>🔔</Text>
            <Text style={styles.menuText}>Notifications</Text>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuIcon}>🌙</Text>
            <Text style={styles.menuText}>Dark Mode</Text>
            <View style={styles.toggle}>
              <View style={styles.toggleInactive} />
            </View>
          </TouchableOpacity>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ABOUT</Text>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuIcon}>ℹ️</Text>
            <Text style={styles.menuText}>About StackLive</Text>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuIcon}>📄</Text>
            <Text style={styles.menuText}>Terms of Service</Text>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuIcon}>🔒</Text>
            <Text style={styles.menuText}>Privacy Policy</Text>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
          <View style={styles.menuItem}>
            <Text style={styles.menuIcon}>📱</Text>
            <Text style={styles.menuText}>Version</Text>
            <Text style={styles.versionText}>1.0.0</Text>
          </View>
        </View>

        {/* Logout Button */}
        {isAuthenticated && (
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        )}

        <View style={{ height: 40 }} />
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
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 24,
    color: '#1F2937',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  content: {
    flex: 1,
  },
  profileSection: {
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    paddingVertical: 32,
    marginBottom: 16,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarIcon: {
    fontSize: 48,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: '#6B7280',
  },
  userId: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
    paddingVertical: 8,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#9CA3AF',
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  menuIcon: {
    fontSize: 20,
    marginRight: 12,
    width: 24,
  },
  menuContent: {
    flex: 1,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
  },
  menuSubtext: {
    fontSize: 13,
    color: '#9CA3AF',
    marginTop: 2,
  },
  chevron: {
    fontSize: 24,
    color: '#D1D5DB',
  },
  versionText: {
    fontSize: 16,
    color: '#9CA3AF',
  },
  toggle: {
    width: 51,
    height: 31,
    borderRadius: 16,
    backgroundColor: '#E5E7EB',
    padding: 2,
  },
  toggleInactive: {
    width: 27,
    height: 27,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
  },
  logoutButton: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 16,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
  },
});
