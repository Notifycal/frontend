import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';

import { getConfigValue, getLocalStorageItem } from '../common/utils';

const BASE_URL = getConfigValue('BACKEND_BASE_URL') as string;

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = getLocalStorageItem('accessToken');

    if (accessToken && !config.skipAuthorization) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

export default apiClient;
