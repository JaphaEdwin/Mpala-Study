import Constants from "expo-constants";

// API Configuration
export const API_URL =
  Constants.expoConfig?.extra?.apiUrl ||
  process.env.EXPO_PUBLIC_API_URL ||
  "http://localhost:8000";

// App Environment
export const APP_ENV =
  Constants.expoConfig?.extra?.appEnv ||
  process.env.EXPO_PUBLIC_APP_ENV ||
  "development";

// Feature flags
export const IS_DEV = APP_ENV === "development";
export const IS_PREVIEW = APP_ENV === "preview";
export const IS_PROD = APP_ENV === "production";

// API timeout
export const API_TIMEOUT = 15000;
