/**
 * @file Navigation Types
 * @description TypeScript types for navigation
 */

import { MiniApp } from '../types';

export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Auth: undefined;
  MainTabs: undefined;
  AppDetail: { app: MiniApp };
  AppWebView: { app: MiniApp };
  Profile: undefined;
};

export type TabParamList = {
  Home: undefined;
  Trending: undefined;
  Collections: undefined;
  MyApps: undefined;
};

export default () => null;