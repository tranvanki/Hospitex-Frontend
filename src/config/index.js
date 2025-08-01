// src/config/index.js
// Configuration file that uses environment variables

const config = {
  // API Configuration
  apiBaseUrl: process.env.VUE_APP_API_BASE_URL || 'https://twoserverweb2.onrender.com',
  apiTimeout: parseInt(process.env.VUE_APP_API_TIMEOUT) || 10000,
  maxFileSize: parseInt(process.env.VUE_APP_MAX_FILE_SIZE) || 5242880,

  // Application Configuration
  appName: process.env.VUE_APP_NAME || 'Hospital Management System',
  appVersion: process.env.VUE_APP_VERSION || '1.0.0',
  
  // Development Configuration
  debug: process.env.VUE_APP_DEBUG === 'true',
  logLevel: process.env.VUE_APP_LOG_LEVEL || 'info',
  
  // Authentication Configuration
  tokenStorageKey: process.env.VUE_APP_TOKEN_STORAGE_KEY || 'token',
  sessionTimeout: parseInt(process.env.VUE_APP_SESSION_TIMEOUT) || 3600000,
  
  // Feature Flags
  enableLogging: process.env.VUE_APP_ENABLE_LOGGING === 'true',
  enableAnalytics: process.env.VUE_APP_ENABLE_ANALYTICS === 'true',
  
  // Environment
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
};

export default config;
