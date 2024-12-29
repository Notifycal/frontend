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

export const setupRequestInterceptor = ({ onRequest, onError }: RequestInterceptor): void => {
  apiClient.interceptors.request.use(onRequest, onError);
};

export interface ResponseInterceptor {
  onResponse: (response: AxiosResponse) => AxiosResponse;
  onResponseError: (error: AxiosError) => Promise<never>;
}

export const setupResponseInterceptor = ({ onResponse, onResponseError }: ResponseInterceptor): void => {
  apiClient.interceptors.response.use(onResponse, onResponseError);
};

export default apiClient;
