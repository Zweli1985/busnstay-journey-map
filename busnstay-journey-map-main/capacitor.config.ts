import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.busnstay.app',
  appName: 'BusNStay',
  webDir: 'dist',
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#1a2744',
      showSpinner: true,
      logoWidth: 200,
      logoHeight: 200,
    },
    Geolocation: {
      permissions: ['location'],
    },
  },
  // Use Vercel for development, will be replaced with local dist for production builds
  server: {
    url: 'https://busnstay-journey-map-main.vercel.app',
    cleartext: false,
  },
};

export default config;
