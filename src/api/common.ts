import axios, { type AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';

let apiClient: ReturnType<typeof axios.create>;

export const initializeApiClient = (baseURL: string): void => {
  apiClient = axios.create({
    baseURL: baseURL,
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

export const getApiClient = (): ReturnType<typeof axios.create> => {
  if (!apiClient) {
    throw new Error('API Client is not initialized. Call initializeApiClient first');
  }

  return apiClient;
};

export interface RequestInterceptor {
  onRequest: (config: InternalAxiosRequestConfig) => InternalAxiosRequestConfig;
  onError: (error: AxiosError) => Promise<never>;
}

export type InterceptorReturn = {
  eject: () => void;
};

export const setupRequestInterceptor = ({ onRequest, onError }: RequestInterceptor): InterceptorReturn => {
  const interceptorId = apiClient.interceptors.request.use(onRequest, onError);

  return {
    eject: (): void => {
      apiClient.interceptors.request.eject(interceptorId);
    }
  };
};

export interface ResponseInterceptor {
  onResponse: (response: AxiosResponse) => AxiosResponse;
  onResponseError: (error: AxiosError) => Promise<never>;
}

export const setupResponseInterceptor = ({ onResponse, onResponseError }: ResponseInterceptor): InterceptorReturn => {
  const interceptorId = apiClient.interceptors.response.use(onResponse, onResponseError);

  return {
    eject: (): void => {
      apiClient.interceptors.response.eject(interceptorId);
    }
  };
};

export default getApiClient;
