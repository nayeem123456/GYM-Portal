import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'in.studycafe.gymbook',
  appName: 'MyGym',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;

