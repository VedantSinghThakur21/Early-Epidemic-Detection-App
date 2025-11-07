import { ConfigContext, ExpoConfig } from "@expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "ShoppingApp",
  slug: "shopping-app",
  version: "1.0.0",
  orientation: "portrait",
  userInterfaceStyle: "light",
  newArchEnabled: true,
  splash: {
    resizeMode: "contain",
    backgroundColor: "#0f172a",
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.shoppingapp",
  },
  android: {
    adaptiveIcon: {
      backgroundColor: "#0f172a",
    },
    package: "com.shoppingapp",
    splash: {
      backgroundColor: "#0f172a",
      resizeMode: "contain",
    },
    config: {
      googleMaps: {
        apiKey: process.env.GOOGLE_MAPS_API_KEY || "",
      },
    },
  },
  web: {
    bundler: "metro",
  },
  extra: {
    maps: {
      // Enable native Google Maps only when an API key is provided
      useNative: !!process.env.GOOGLE_MAPS_API_KEY,
    },
    eas: {
      projectId: "0d767ef1-350f-45db-9d1c-907e5d0cbcc2",
    },
  },
});
