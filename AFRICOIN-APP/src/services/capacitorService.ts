// @ts-ignore - Capacitor modules loaded at runtime
const Storage = window.capacitor?.Storage
// @ts-ignore
const Device = window.capacitor?.Device
// @ts-ignore
const App = window.capacitor?.App

/**
 * Capacitor Plugin Utilities
 * Helper functions for native app features
 */

// Storage Utilities
export const StorageService = {
  async set(key: string, value: any) {
    await Storage.set({
      key,
      value: JSON.stringify(value),
    })
  },

  async get(key: string) {
    const { value } = await Storage.get({ key })
    return value ? JSON.parse(value) : null
  },

  async remove(key: string) {
    await Storage.remove({ key })
  },

  async clear() {
    await Storage.clear()
  },
}

// Device Utilities
export const DeviceService = {
  async getInfo() {
    return await Device.getId()
  },

  async getDeviceInfo() {
    return await Device.getInfo()
  },

  async getLanguageCode() {
    return await Device.getLanguageCode()
  },
}

// App Utilities
export const AppService = {
  async getInfo() {
    return await App.getInfo()
  },

  async exitApp() {
    await App.exitApp()
  },

  // Handle back button on Android
  setupBackButton(callback: () => void) {
    App?.addListener('backButton', (event: any) => {
      if (!event?.canGoBack) {
        App?.exitApp()
      } else {
        callback()
      }
    })
  },
}

// Check if running on native platform
export const isNativePlatform = () => {
  return (
    (window as any).capacitor !== undefined ||
    (window as any).cordova !== undefined ||
    document.URL.indexOf('http://localhost') === -1
  )
}

// Get platform info
export const getPlatformInfo = async () => {
  if (!isNativePlatform()) {
    return { platform: 'web' }
  }

  try {
    const info = await DeviceService.getDeviceInfo()
    const appInfo = await AppService.getInfo()
    return {
      platform: info.platform,
      ...info,
      ...appInfo,
    }
  } catch (error) {
    console.error('Error getting platform info:', error)
    return { platform: 'unknown' }
  }
}

export default {
  StorageService,
  DeviceService,
  AppService,
  isNativePlatform,
  getPlatformInfo,
}
