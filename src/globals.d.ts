export {}; // This ensures the file is treated as a module

declare global {
  type ConfigKey = 'GOOGLE_CLIENT_ID' | 'BACKEND_BASE_URL' | 'STATIC_LANDING_URL' | 'TIER_INFO';
  type GlobalConfig = {
    [key in ConfigKey]: string;
  };

  interface Window {
    globalConfig: GlobalConfig;
  }
}
