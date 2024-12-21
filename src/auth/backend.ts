import type { CodeResponse } from '@react-oauth/google';

type Jwt = string;

interface LoginResponse {
  accessToken: string;
  tokenType: 'Bearer';
  refreshToken: 'WIP';
}

const URL = 'http://localhost:8080/api/v1/login';

export const userLogin = async (codeResponse: CodeResponse): Promise<[Jwt, string]> => {
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

    const body = await response.json();
    const { accessToken, refreshToken } = body as LoginResponse;

    if (response.status === 200 && accessToken && refreshToken) {
      return [accessToken, refreshToken];
    } else {
      throw new Error('No 200 or access/refresh token present in response');
    }
  } catch (error) {
    console.log('POR EL OTRO LAO');
    throw new Error(`Something went wrong about api/v1/login call. Error: ${JSON.stringify(error)}`);
  }
};
