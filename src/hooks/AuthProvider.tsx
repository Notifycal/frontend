import type { CodeResponse } from '@react-oauth/google';
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';

import { userLogin } from '../auth/backend';
import { checkScopes } from '../auth/google';

import { getLocalStorageItem, setLocalStorageItem, sleep } from '../common/utils';

import type { FunctionComponent } from '../common/types';

type LoginError = 'loginErrorInvalidScopes' | null;

export interface AuthContext {
  isAuthenticated: boolean;
  login: (codeResponse: CodeResponse) => Promise<void>;
  logout: () => Promise<void>;
  loginError: LoginError;
}

const AuthContext = createContext<AuthContext | null>(null);

export const AuthProvider = ({ children }: {children: ReactNode}): FunctionComponent => {
  const [accessToken, setAccessToken] = useState<string | null>(getLocalStorageItem('accessToken'));
  const [refreshToken, setRefreshToken] = useState<string | null>(getLocalStorageItem('refreshToken'));
  const [loginError, setLoginError] = useState<LoginError>(null);

  const isAuthenticated = !!accessToken && !!refreshToken; // TODO

  const login = useCallback(async (codeResponse: CodeResponse) => {
    await sleep(500);

    if (checkScopes(codeResponse.scope)) {
      const { accessToken, refreshToken } = await userLogin(codeResponse);
      setAccessToken(accessToken);
      setLocalStorageItem('accessToken', accessToken);
      
      setRefreshToken(refreshToken);
      setLocalStorageItem('refreshToken', refreshToken);
    } else {
      setLoginError('loginErrorInvalidScopes');
    }
  }, []);

  const logout = useCallback(async () => {
    await sleep(250);
    // TODO: Call backend logout to invalidate tokens
    setLocalStorageItem('accessToken', null);
    setAccessToken(null);

    setLocalStorageItem('refreshToken', null);
    setRefreshToken(null);
  }, []);

  useEffect(() => {
    setAccessToken(getLocalStorageItem('accessToken'));
    setRefreshToken(getLocalStorageItem('refreshToken'));
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, loginError }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContext  => {
  const context = useContext(AuthContext);
  if (! context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
