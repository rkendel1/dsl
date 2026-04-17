/**
 * @file index.js
 * @description Custom entry point for Expo Router that ensures polyfills are loaded first
 * 
 * This file is loaded before any other code, ensuring that React Native polyfills
 * for Node.js APIs (crypto, process, etc.) are set up before the SDK is imported.
 */

// Import polyfills FIRST - before ANYTHING else
import './app/polyfills';

// Import and export the Expo Router entry point
import 'expo-router/entry';
