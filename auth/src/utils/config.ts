export const isDevelopmentEnv =
  !process.env.NODE_ENV || process.env.NODE_ENV === 'development';
export const isTestEnvironment = process.env.NODE_ENV === 'test';
