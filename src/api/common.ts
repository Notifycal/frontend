import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';

import { getConfigValue } from '../common/utils';

const BASE_URL = getConfigValue('BACKEND_BASE_URL');

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const setupRequestInterceptor = (
  onRequest: (config: InternalAxiosRequestConfig) => InternalAxiosRequestConfig | Promise<InternalAxiosRequestConfig>,
  onError: (error: AxiosError) => Promise<never>
): void => {
  apiClient.interceptors.request.use(onRequest, onError);
};

export default apiClient;
