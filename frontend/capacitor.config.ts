import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.kali.app',
  appName: 'kali_app',
  webDir: 'dist',
  server: {
    cleartext: true
  }
};

export default config;
