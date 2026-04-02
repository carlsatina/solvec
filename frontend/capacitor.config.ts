import { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.solvec.evtaxi',
  appName: 'E-Ride Taxi',
  webDir: 'dist',
  bundledWebRuntime: false,
  android: {
    allowMixedContent: true
  }
}

export default config
