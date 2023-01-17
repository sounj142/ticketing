import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import { toast } from 'react-toastify';
import { store } from '../stores/store';
import { history } from '../utils/route';

function getFistErrorMessage(data: any): string | undefined {
  if (data.errors?.length) {
    const firstError: any = data.errors[0];
    return firstError ? firstError.message : undefined;
  }
  return undefined;
}

function toastFistErrorMessage(data: any) {
  const firstError = getFistErrorMessage(data);
  firstError && toast.error(firstError);
}

function handleGenericResponse(data: any, defaultMessage: string) {
  const errorMessage =
    getFistErrorMessage(data) ||
    (typeof data === 'string' && data.length ? data : defaultMessage);
  toast.error(errorMessage);
}

function handle400Response(data: any, config: AxiosRequestConfig<{}>) {
  handleGenericResponse(data, 'Bad Request.');
}

function handle401Response(data: any) {
  handleGenericResponse(data, 'Unauthorized.');
}

function handle403Response(data: any) {
  handleGenericResponse(data, 'Unauthorized.');
}

function handle404Response(data: any) {
  toastFistErrorMessage(data);
  history.push('/not-found');
}

function handle500Response(data: any) {
  store.commonStore.setServerSideErrorMessage(
    getFistErrorMessage(data) || 'Unknown error.'
  );
  history.push('/server-side-error');
}

axios.interceptors.request.use(async (request) => {
  const token = store.userStore.user?.token;
  if (request.headers) {
    if (token) (request.headers as any).Authorization = `Bearer ${token}`;
  }
  return request;
});

axios.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (!error.response) return Promise.reject(error);

    const { data, status, config } = error.response as AxiosResponse;
    const ignoreStatusCodes: number[] | undefined = (config as any)
      .ignoreStatusCodes;
    if (ignoreStatusCodes && ignoreStatusCodes.find((x) => x === status)) {
      return Promise.reject(error);
    }
    switch (status) {
      case 400:
        handle400Response(data, config);
        break;
      case 401:
        handle401Response(data);
        break;
      case 403:
        handle403Response(data);
        break;
      case 404:
        handle404Response(data);
        break;
      case 500:
        handle500Response(data);
        break;
    }
    return Promise.reject(error);
  }
);

const returnResponseBody = <T>(response: AxiosResponse<T>) => response.data;

export const requests = {
  get: <T>(url: string, config?: AxiosRequestConfig<{}>) =>
    axios.get<T>(url, config).then(returnResponseBody),
  post: <T, R>(url: string, body: T, config?: AxiosRequestConfig<T>) =>
    axios
      .post<R, AxiosResponse<R>, T>(url, body, config)
      .then(returnResponseBody),
  put: <T, R>(url: string, body: T, config?: AxiosRequestConfig<T>) =>
    axios
      .put<R, AxiosResponse<R>, T>(url, body, config)
      .then(returnResponseBody),
  delete: (url: string, config?: AxiosRequestConfig<{}>) =>
    axios.delete(url, config).then(returnResponseBody),
};
