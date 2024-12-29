import axios, { type AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';

import { getConfigValue } from '../common/utils';

const BASE_URL = getConfigValue('BACKEND_BASE_URL');

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

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

export default apiClient;
