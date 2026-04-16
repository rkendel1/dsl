/**
 * @file Storage Service
 * @description Handles local storage for user session and preferences
 * Note: Favorites are managed via DSL flows, not local storage
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_TOKEN_KEY = '@stacklive_user_token';
const USER_ID_KEY = '@stacklive_user_id';

/**
 * Save user authentication token
 */
export async function saveUserToken(token: string): Promise<void> {
  try {
    await AsyncStorage.setItem(USER_TOKEN_KEY, token);
  } catch (error) {
    console.error('Error saving user token:', error);
  }
}

/**
 * Get user authentication token
 */
export async function getUserToken(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(USER_TOKEN_KEY);
  } catch (error) {
    console.error('Error getting user token:', error);
    return null;
  }
}

/**
 * Remove user authentication token
 */
export async function removeUserToken(): Promise<void> {
  try {
    await AsyncStorage.removeItem(USER_TOKEN_KEY);
  } catch (error) {
    console.error('Error removing user token:', error);
  }
}

/**
 * Save user ID
 */
export async function saveUserId(userId: string): Promise<void> {
  try {
    await AsyncStorage.setItem(USER_ID_KEY, userId);
  } catch (error) {
    console.error('Error saving user ID:', error);
  }
}

/**
 * Get user ID
 */
export async function getUserId(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(USER_ID_KEY);
  } catch (error) {
    console.error('Error getting user ID:', error);
    return null;
  }
}

/**
 * Remove user ID
 */
export async function removeUserId(): Promise<void> {
  try {
    await AsyncStorage.removeItem(USER_ID_KEY);
  } catch (error) {
    console.error('Error removing user ID:', error);
  }
}

export default () => null;

