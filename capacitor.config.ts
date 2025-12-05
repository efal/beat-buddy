import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
    appId: 'com.beatbuddy.metronome',
    appName: 'Beat Buddy',
    webDir: 'dist',
    server: {
        androidScheme: 'https'
    },
    android: {
        backgroundColor: '#0f172a',
        allowMixedContent: true,
        captureInput: true,
        webContentsDebuggingEnabled: true
    }
};

export default config;
