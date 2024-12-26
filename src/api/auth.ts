import type { CodeResponse } from '@react-oauth/google';

import apiClient from './common';

export interface LoginResponse {
  accessToken: string;
  tokenType: 'Bearer';
  refreshToken: 'WIP';
}

export const login = async (codeResponse: CodeResponse): Promise<LoginResponse> => {
  try {
    const response = await apiClient.post('/login', {
      'google-code': codeResponse.code
    }, {
      skipAuthorization: true
    });

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
