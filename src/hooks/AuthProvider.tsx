import type { CodeResponse } from '@react-oauth/google';
import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import type { FunctionComponent } from '../common/types';

export interface AuthContext {
  isAuthenticated: boolean;
  codeResponse: CodeResponse | null;
  login: (codeResponse: CodeResponse | null) => Promise<void>;
}

type Jwt = string;
interface LoginResponse {
  accessToken: string;
  tokenType: 'Bearer';
  refreshToken: 'WIP';
}


const AuthContext = createContext<AuthContext | null>(null);

const accessTokenKey = 'accessToken';
const refreshTokenKey = 'refreshToken';

function getAuthenticationStatus(): boolean {
  return !!localStorage.getItem(accessTokenKey);
}

function setAuthenticationStatus(accessToken: Jwt, refreshToken: string): void {
  localStorage.setItem(accessTokenKey, accessToken);
  localStorage.setItem(refreshTokenKey, refreshToken);
}

function backendLogin(codeResponse: CodeResponse): Promise<[Jwt, string]> {
  return fetch('http://localhost:8080/api/v1/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      'google-code': codeResponse.code
    })
  }).then(
    async (resp) => {
      const body = await resp.json() as LoginResponse;
      const accessToken = body.accessToken;
      const refreshToken = body.refreshToken;
      if (resp.status === 200 && accessToken && refreshToken)
        return [accessToken, refreshToken];
      else 
        throw new Error('No 200 or access/refresh token present in response')
      },
    (error) => {
      console.log('POR EL OTRO LAO');
      throw new Error(`Something went wrong about api/v1/login call. Error: ${JSON.stringify(error)}`)
    }
  );
}

function checkScopes(scopes: string): boolean {
  const expectedScopes = [
    'https://www.googleapis.com/auth/contacts.readonly',
    'https://www.googleapis.com/auth/calendar.addons.execute',
    'https://www.googleapis.com/auth/calendar.settings.readonly',
    'https://www.googleapis.com/auth/calendar.events.readonly',
    'https://www.googleapis.com/auth/calendar.events',
    'https://www.googleapis.com/auth/calendar.readonly',
    'https://www.googleapis.com/auth/calendar', 
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email'
  ];
  return expectedScopes.every((item) => scopes.includes(item));
}

const AuthProvider = ({ children }: { children: ReactNode }): FunctionComponent => {
  const [codeResponse, setCodeResponse] = useState<CodeResponse | null>(null);
  const isAuthenticated = getAuthenticationStatus();

  // eslint-disable-next-line unicorn/prevent-abbreviations
  const login = useCallback((codeRes: CodeResponse | null) => {
    if (codeRes !== null && checkScopes(codeRes.scope)) {
      setCodeResponse(codeRes);
      return backendLogin(codeRes).then(([accessToken, refreshToken]) => {
        setAuthenticationStatus(accessToken, refreshToken);
      });
    }
    return Promise.reject(new Error('Susto!'));
  }, []);

  return <AuthContext.Provider value={{ isAuthenticated, codeResponse, login }}>{children}</AuthContext.Provider>;
};

export default AuthProvider;

export const useAuth = (): AuthContext | Error => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
