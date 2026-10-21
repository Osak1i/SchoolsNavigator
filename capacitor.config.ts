import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'lv.rtk.navigator',
  appName: 'RTK Navigator',
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
