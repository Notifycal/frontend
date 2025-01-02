import axios, {
  type AxiosError,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig
} from 'axios';

import getApiClient, { type RequestInterceptor, type ResponseInterceptor } from './common';

import type { CodeResponse } from '@react-oauth/google';

interface GenericAuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: 'Bearer';
}

export type LoginResponse = GenericAuthResponse;
export type RefreshResponse = GenericAuthResponse;

export const login = async (codeResponse: CodeResponse): Promise<LoginResponse> => {
  try {
    const response = await getApiClient().post(
      '/api/v1/login',
      { googleCode: codeResponse.code },
      { skipAuthorization: true, skipTokenRefresh: true }
    );

    const body = response.data as LoginResponse;

    if (response.status === 200) {
      // Returning all the body as we'll need refresh token and expiry soon as well?
      return body;
    } else {
      throw new Error('No 200 or access/refresh token present in response');
    }
  } catch (error) {
    throw new Error(`Something went wrong about api/v1/login call. Error: ${JSON.stringify(error)}`);
  }
};

export const refresh = async (refreshToken: string): Promise<RefreshResponse> => {
  try {
    const response = await getApiClient().post(
      '/api/v1/refresh',
      { refreshToken: refreshToken },
      { skipAuthorization: true, skipTokenRefresh: true }
    );

    const body = response.data as RefreshResponse;

    if (response.status === 200) {
      return body;
    } else {
      throw new Error('No 200 or access/refresh token present in response');
    }
  } catch (error) {
    throw new Error(`Something went wrong about api/v1/refresh call. Error: ${JSON.stringify(error)}`);
  }
};

export const createAuthInterceptor = (accessToken: string): RequestInterceptor => {
  return {
    onRequest: (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
      if (accessToken && !config.skipAuthorization) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    },
    onError: (error: AxiosError) => Promise.reject(error)
  };
};

export type TokenRefreshCallback = (accessToken: string | null, refreshToken: string | null, success: boolean) => void;

export const createUnauthorizedInterceptor = (
  refreshToken: string,
  onTokenRefresh: TokenRefreshCallback
): ResponseInterceptor => {
  return {
    onResponse: (response: AxiosResponse) => response,
    onResponseError: async (error: AxiosError): Promise<never> => {
      const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

      if (originalRequest.skipTokenRefresh) {
        return Promise.reject(error);
      }

      // TODO: max number of retries?
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const response = await refresh(refreshToken);
          onTokenRefresh(response.accessToken, response.refreshToken, true);

          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${response.accessToken}`;
          }

          // Retry the original request
          return await axios(originalRequest);
        } catch (error) {
          onTokenRefresh(null, null, false);
          console.log('Token refresh failed', error);
          return Promise.reject(error as Error);
        }
      }
      return Promise.reject(error);
    }
  };
};
