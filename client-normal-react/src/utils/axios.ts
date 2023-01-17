import { AxiosRequestConfig } from 'axios';

export function ignoreStatusCodes<T>(
  config?: AxiosRequestConfig<T>,
  ...ignoreStatusCodes: number[]
): AxiosRequestConfig<T> {
  if (!ignoreStatusCodes?.length) ignoreStatusCodes = [400];
  return { ...config, ignoreStatusCodes } as AxiosRequestConfig<T>;
}
