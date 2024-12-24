import type { CodeResponse } from '@react-oauth/google';
import { getConfigValue } from '../common/utils';

export interface LoginResponse {
  accessToken: string;
  tokenType: 'Bearer';
  refreshToken: 'WIP';
}

const BASE_URL = getConfigValue('BACKEND_BASE_URL') as string;
const URL = `${BASE_URL}/api/v1/login`;

export const userLogin = async (codeResponse: CodeResponse): Promise<LoginResponse> => {
  try {
    const response = await fetch(URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'google-code': codeResponse.code
      })
    });

    const body = (await response.json()) as LoginResponse;

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
