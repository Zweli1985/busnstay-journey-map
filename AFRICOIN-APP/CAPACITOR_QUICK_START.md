# Capacitor Quick Start Guide

## 🚀 One-Minute Setup

### Prerequisite: Install Xcode or Android Studio

**For iOS (macOS only):**
```bash
# Download Xcode from App Store
# Or use terminal:
xcode-select --install
```

**For Android:**
- Download from: https://developer.android.com/studio
- Install Android SDK tools

---

## 📱 Build Your First Native App

### Step 1: Build the Web App
```bash
npm run build
```

### Step 2: Add iOS Platform
```bash
npm run cap:add:ios
```
This creates the `ios/App` Xcode project.

### Step 3: Open in Xcode
```bash
npm run cap:open:ios
```

### Step 4: Run on Simulator
- Select "iPhone 14" from the device dropdown
- Click the ▶️ play button
- App launches in simulator!

---

## 📦 Add Android Platform

### Step 1: Add Platform
```bash
npm run cap:add:android
```

### Step 2: Open in Android Studio
```bash
npm run cap:open:android
```

### Step 3: Configure
- Select "Create Virtual Device" if no emulator exists
- Choose Pixel 4a preset
- Download Android API 34

### Step 4: Run
- Select emulator from device list
- Click ▶️ "Run app"

---

## 🔄 Update Web App Changes

After modifying React components:

```bash
npm run cap:sync
```

This syncs all changes to iOS and Android projects.

---

## 📋 Available Scripts

```bash
# Development
npm run dev              # Web dev server (http://localhost:5173)
npm run build            # Build web app to dist/

# Capacitor iOS
npm run cap:add:ios      # Create iOS project
npm run cap:open:ios     # Open Xcode
npm run cap:run:ios      # Run on iOS simulator

# Capacitor Android
npm run cap:add:android  # Create Android project
npm run cap:open:android # Open Android Studio
npm run cap:run:android  # Run on Android emulator

# General
npm run cap:sync         # Sync web to native
npm run cap              # Run capacitor CLI
```

---

## 🎯 Test the App

### Login Page
- Email: test@example.com
- Password: password123
- Or click "Register" to create new account

### Features to Test
✅ Login/Register
✅ KYC Verification (5 steps)
✅ Dashboard with wallets
✅ Transaction history
✅ Payment methods
✅ Settings
✅ Profile management

---

## 🔌 Native Features Available

### Storage (Persistent Data)
```typescript
import { StorageService } from '@/services/capacitorService'

// Save data
await StorageService.set('user_data', { name: 'John' })

// Load data
const userData = await StorageService.get('user_data')
```

### Device Info
```typescript
import { DeviceService } from '@/services/capacitorService'

// Get device info
const info = await DeviceService.getDeviceInfo()
// Returns: { platform: 'ios' | 'android', version, ... }
```

### App Control
```typescript
import { AppService } from '@/services/capacitorService'

// Get app version
const appInfo = await AppService.getInfo()

// Exit app
await AppService.exitApp()
```

---

## 📱 Platform Support

| Feature | Web | iOS | Android |
|---------|-----|-----|---------|
| Login/Auth | ✅ | ✅ | ✅ |
| KYC Form | ✅ | ✅ | ✅ |
| Dashboard | ✅ | ✅ | ✅ |
| Transactions | ✅ | ✅ | ✅ |
| Payments | ✅ | ✅ | ✅ |
| Storage | ✅ | ✅ | ✅ |
| Device Info | ✅ | ✅ | ✅ |

---

## 🐛 Common Issues

### "command not found: capacitor"
**Solution:** Use npm scripts
```bash
npm run cap:add:ios
# Not: capacitor add ios
```

### iOS build fails
**Solution:** Update CocoaPods
```bash
cd ios/App && pod install && cd ../..
npm run cap:sync
npm run cap:run:ios
```

### Android build slow
**Answer:** First build takes 5-10 minutes
- Is Android Studio running? Close unused apps
- Need more RAM? 8GB+ recommended
- Update SDK tools: Check Android Studio > SDK Manager

### App doesn't appear on device
**Solution:**
1. Ensure device is connected: `adb devices`
2. Enable USB debugging on device
3. Run: `npm run cap:run:android`

---

## 📚 Next Steps

1. ✅ You've already built the web app
2. 👉 Install Xcode or Android Studio
3. 👉 Run `npm run cap:add:ios` (or android)
4. 👉 Run `npm run cap:open:ios` (or android)
5. 👉 Click ▶️ to run on simulator
6. 🎉 See your app on your device!

---

## 📖 Documentation

- Capacitor: https://capacitorjs.com
- Capacitor Plugins: https://capacitorjs.com/plugins
- React: https://react.dev
- Vite: https://vitejs.dev

---

**Your Africoin app is ready for iOS and Android! 🚀**

Enjoy building!
