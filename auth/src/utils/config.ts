export const isDevelopmentEnv =
  !process.env.NODE_ENV || process.env.NODE_ENV === 'development';
export const isTestEnvironment = process.env.NODE_ENV === 'test';
export const jwtExpiresIn = process.env.JWT_EXPIRES_IN!;
export const refreshExpiresIn = process.env.REFRESH_EXPIRES_IN!;
