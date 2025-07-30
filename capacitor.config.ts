import type { CapacitorConfig } from '@capacitor/cli';
import { KeyboardResize } from '@capacitor/keyboard';

const config: CapacitorConfig = {
  appId: 'com.speedo.example',
  appName: 'speedo',
  webDir: 'www',
  server: {
    cleartext: true,
    allowNavigation: ['*'],
    androidScheme: 'http'
  },
  android: {
    allowMixedContent: true,
  },
  plugins: {
    Keyboard: {
      resize: KeyboardResize.Body,
      resizeOnFullScreen: true
    },
    SplashScreen: {
      launchAutoHide: false,
    },
    StatusBar: {
      overlaysWebView: true
    }
  }
};

export default config;
