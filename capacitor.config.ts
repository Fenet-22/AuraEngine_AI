import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.auraengine.ai',
  appName: 'AuraEngine',
  webDir: 'out',
  server: {
    // REPLACE 'YOUR_IP' with your computer's IP address (e.g., 192.168.1.5)
    url: 'http://192.168.43.210:3000',
    cleartext: true
  }
};

export default config;
