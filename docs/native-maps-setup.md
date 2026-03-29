# Native Google Maps (Capacitor)

This app uses the official `@capacitor/google-maps` plugin for native maps.

## Install

```bash
cd frontend
npm install
npx cap sync
```

## API Keys

You must create Google Maps API keys with billing enabled for Android and iOS.

### Android

Add your API key to `android/app/src/main/AndroidManifest.xml` inside the `<application>` tag:

```xml
<meta-data
  android:name="com.google.android.geo.API_KEY"
  android:value="YOUR_API_KEY_HERE" />
```

If you want to access location features, add permissions too:

```xml
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
```

### iOS

Add the required location usage description in `ios/App/App/Info.plist`:

```xml
<key>NSLocationWhenInUseUsageDescription</key>
<string>We use your location to set accurate pickup points.</string>
```

## Web Preview

For web preview, set `VITE_GOOGLE_MAPS_API_KEY` in `frontend/.env` based on `.env.example`.
