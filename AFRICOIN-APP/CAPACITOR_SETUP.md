# Africoin Capacitor App Setup Guide

## Overview

This guide will help you convert the Africoin web app into a native iOS and Android application using Capacitor.

## Prerequisites

- Node.js & npm (already installed ✅)
- Xcode (for iOS development) - Download from App Store
- Android Studio (for Android development) - Download from developer.android.com
- Capacitor CLI (will be installed via npm)

## Current Status

✅ React web app fully functional at http://localhost:5173
✅ Capacitor core & cli installed
✅ Capacitor config created (capacitor.config.ts)
✅ Build scripts added to package.json

## Quick Setup Commands

### Step 1: Build the React App
```bash
npm run build
```
This creates the `dist/` folder with optimized production files that Capacitor will use.

### Step 2: Add iOS Platform
```bash
npm run cap:add:ios
```
This creates the `ios/` folder with Xcode project files.

**Requirements:**
- macOS system
- Xcode installed
- iOS deployment target: 13.0+

### Step 3: Add Android Platform
```bash
npm run cap:add:android
```
This creates the `android/` folder with Android Studio project files.

**Requirements:**
- JDK 11+
- Android SDK API 21+
- Android Studio installed

### Step 4: Sync Web Assets
After any React code changes, sync the app:
```bash
npm run cap:sync
```

This will:
1. Build the React app
2. Copy web files to native platforms
3. Update platform dependencies

## Development Workflow

### Web Development (Desktop)
```bash
npm run dev
# App runs at http://localhost:5173
# Edit React components and see hot-reload
```

### iOS Development
```bash
npm run build
npm run cap:sync
npm run cap:open:ios
# Xcode opens with the iOS project
# Build and run from Xcode simulator or device
```

### Android Development
```bash
npm run build
npm run cap:sync
npm run cap:open:android
# Android Studio opens with the Android project
# Build and run from Android emulator or device
```

### Run on Devices
```bash
# iOS (requires macOS and Xcode)
npm run cap:run:ios

# Android (requires Android Studio SDK tools)
npm run cap:run:android
```

## Project Structure

```
africoin-app/
├── src/                      # React source code
├── dist/                     # Built web app (created by npm run build)
├── android/                  # Android native project
├── ios/                      # iOS native project
├── capacitor.config.ts       # Capacitor configuration
├── package.json              # Project dependencies & scripts
└── tsconfig.json             # TypeScript config
```

## Capacitor Configuration

The `capacitor.config.ts` file contains:
- **appId**: `com.africoin.app` - Unique app identifier
- **appName**: `Africoin` - Display name
- **webDir**: `dist` - Web assets directory
- **plugins**: Configuration for native plugins

## Available Capacitor Plugins for This App

### Already Included
- Splash Screen - App launch screen

### Recommended for Future Features
```bash
# Storage (Local data persistence)
npm install @capacitor/storage --legacy-peer-deps

# Network Information
npm install @capacitor/network --legacy-peer-deps

# Device Info
npm install @capacitor/device --legacy-peer-deps

# Camera (for KYC document upload)
npm install @capacitor/camera --legacy-peer-deps

# File System (for document storage)
npm install @capacitor/filesystem --legacy-peer-deps

# Biometric (fingerprint/face ID authentication)
npm install @capacitor/identity-credential --legacy-peer-deps

# Push Notifications
npm install @capacitor/push-notifications --legacy-peer-deps
```

## App Features Working on Mobile

✅ Authentication (Login/Register)
✅ KYC Verification (5-step form)
✅ Multi-wallet Dashboard
✅ Transaction History
✅ Payment Processing
✅ Cross-border Transfers
✅ Account Settings
✅ User Profiles

## Common Issues & Solutions

### Issue: "capacitor: command not found"
**Solution:** Use npm scripts instead
```bash
npm run cap add ios
npm run cap sync
```

### Issue: iOS build fails
**Solution:** Update CocoaPods
```bash
cd ios/App
pod install
cd ../..
```

### Issue: Android build fails
**Solution:** Update Gradle
```bash
cd android
./gradlew clean build
cd ..
```

### Issue: Web assets not updating
**Solution:** Always run sync after changes
```bash
npm run build
npm run cap:sync
```

## Building for App Stores

### iOS App Store
1. Open Xcode: `npm run cap:open:ios`
2. Sign with Apple Developer account
3. Set version & build number
4. Archive and submit to App Store Connect

### Google Play Store
1. Open Android Studio: `npm run cap:open:android`
2. Build signed APK/AAB
3. Upload to Google Play Console

## Testing the App

### LocalHost Testing
```bash
# Start dev server
npm run dev

# In browser
http://localhost:5173

# Test all features:
# - Register account
# - Complete KYC
# - View dashboard
# - Check transactions
# - Make payments
```

### Native Testing

After adding platforms, test features that use native APIs:
- Camera access (KYC document upload)
- Storage (local data persistence)
- Network status (offline detection)
- Device info

## Environment Variables

For production, add to `.env` or `vite.config.ts`:
```env
VITE_API_URL=https://api.africoin.app
VITE_STRIPE_KEY=pk_live_...
VITE_SOLANA_NETWORK=mainnet-beta
```

## Production Deployment

### Web
```bash
npm run build
# Deploy dist/ folder to Vercel/Netlify
```

### iOS
1. Increase version number in `ios/App/App/Info.plist`
2. Build archive in Xcode
3. Submit to App Store

### Android
1. Increase versionCode in `android/app/build.gradle`
2. Build signed APK/AAB
3. Upload to Google Play

## Useful Resources

- Capacitor Docs: https://capacitorjs.com/docs
- Capacitor Plugins: https://capacitorjs.com/plugins
- React Router Mobile: https://reactrouter.com/en/main
- Vite Config: https://vitejs.dev/config/

## Next Steps

1. **Install Xcode** (if you want iOS support)
2. **Install Android Studio** (if you want Android support)
3. **Run:** `npm run build` to create dist folder
4. **Add platform:** `npm run cap:add:ios` or `npm run cap:add:android`
5. **Open IDE:** `npm run cap:open:ios` or `npm run cap:open:android`
6. **Build & Test** in simulator or on device

## Support

For issues:
1. Check Capacitor documentation
2. Review platform-specific error messages
3. Ensure all prerequisites are installed
4. Run `npm run cap:sync` after any changes

---

**Your Africoin app is now ready for mobile development! 🚀**

Current Version: 1.0.0
Last Updated: February 18, 2026
