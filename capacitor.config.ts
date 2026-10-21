import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'lv.rtk.navigator',
  appName: 'School Navigator',
  webDir: 'dist',
  android: {
    buildOptions: {
      keystorePath: undefined,
      keystoreAlias: undefined,
    },
  },
  server: {
    androidScheme: 'https',
  },
};

export default config;
