import type { CapacitorConfig } from '@capacitor/cli';
import { KeyboardResize } from '@capacitor/keyboard';
import { StatusBar } from '@capacitor/status-bar';

const config: CapacitorConfig = {
  appId: 'iraqsoft.speedolive.com',
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
      resizeOnFullScreen: false
    },
    SplashScreen: {
      launchAutoHide: false,
    },
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"]
    }, EdgeToEdge: {
      backgroundColor: "#ffffff"
    }

  }
};

export default config;
