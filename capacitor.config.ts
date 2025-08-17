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
      resizeOnFullScreen: true
    },
    SplashScreen: {
      launchAutoHide: false,
    },
    StatusBar: {
      backgroundColor: "#ffffffff",
      style: "LIGHT"
    }, PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"]
    }

  }
};

export default config;
