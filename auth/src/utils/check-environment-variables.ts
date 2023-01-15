export function checkEnvironmentVariables(...params: string[]) {
  for (const variableName of params) {
    if (!process.env[variableName]) {
      throw new Error(`Missing environment variable ${variableName}`);
    }
  }
}
