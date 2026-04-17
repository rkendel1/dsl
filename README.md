# StackLive DSL - React Native Reference Implementation 👋

This is a React Native app demonstrating how to use the `@stacklive/sdk` DSL for building portable, identity-aware experiences.

## 🚀 Quick Start

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

3. Open in your preferred platform
   - [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
   - [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
   - [Expo Go](https://expo.dev/go)

## 📚 Documentation

### Setup & Configuration
- **[BEFORE_AFTER.md](BEFORE_AFTER.md)** - Visual comparison of the SDK initialization fix
- **[SDK_SETUP_FIX.md](SDK_SETUP_FIX.md)** - Technical details of SDK polyfills setup
- **[FIX_SUMMARY.md](FIX_SUMMARY.md)** - Comprehensive fix summary with metrics
- **[REACT_NATIVE_FIX.md](REACT_NATIVE_FIX.md)** - General React Native setup guide

### DSL Usage
- **[DSL_FLOWS.md](DSL_FLOWS.md)** - How to create and use DSL flows
- **[AUTH_QUICK_REFERENCE.md](AUTH_QUICK_REFERENCE.md)** - Authentication flow examples
- **[IMPLEMENTATION_MINIAPPS.md](IMPLEMENTATION_MINIAPPS.md)** - Mini apps implementation guide

## 🎯 Key Features

- ✅ **SDK Integration**: Properly configured `@stacklive/sdk` with React Native polyfills
- ✅ **DSL Flows**: Authentication, mini apps, and other capabilities via DSL
- ✅ **Type Safety**: Full TypeScript support with type-safe DSL
- ✅ **Clean Architecture**: Separation of concerns with flows, services, and contexts

## 🏗️ Project Structure

```
project/
├── index.js              # Custom entry point (loads polyfills first)
├── app/
│   ├── polyfills.ts     # React Native polyfills for SDK
│   ├── _layout.tsx      # App layout with providers
│   ├── (tabs)/          # Tab navigation screens
│   ├── flows/           # DSL flow definitions
│   ├── services/        # API services using DSL
│   └── contexts/        # React contexts
└── components/          # Reusable UI components
```

## 🔧 How It Works

This app uses a custom entry point (`index.js`) to ensure that React Native polyfills are loaded before the SDK:

```
index.js → polyfills.ts → expo-router/entry → app
```

This guarantees that crypto and process globals are available when the SDK initializes.

## 📖 Learn More

### About Expo
- [Expo documentation](https://docs.expo.dev/)
- [Expo tutorial](https://docs.expo.dev/tutorial/introduction/)

### About StackLive SDK
- Check the documentation files in this repository
- See `app/flows/` for DSL flow examples
- See `app/services/api.ts` for SDK usage patterns

## 🤝 Community

- [Expo on GitHub](https://github.com/expo/expo)
- [Discord community](https://chat.expo.dev)

---

**Status:** ✅ Fully functional with SDK v0.1.5+  
**Last Updated:** 2026-04-17
