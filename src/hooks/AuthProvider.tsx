import type { CodeResponse } from '@react-oauth/google';
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';

import { userLogin } from '../auth/backend';
import { checkScopes } from '../auth/google';

import { getLocalStorageItem, setLocalStorageItem } from '../common/utils';

import type { FunctionComponent } from '../common/types';

type LoginError = 'loginErrorInvalidScopes' | null;

export interface AuthContext {
  isAuthenticated: boolean;
  login: (codeResponse: CodeResponse) => Promise<void>;
  logout: () => Promise<void>;
  loginError: LoginError;
}

type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  loginError: LoginError;
};

const AuthContext = createContext<AuthContext | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }): FunctionComponent => {
  const [authState, setAuthState] = useState<AuthState>({
    accessToken: getLocalStorageItem('accessToken'),
    refreshToken: getLocalStorageItem('refreshToken'),
    loginError: null
  });

  const { accessToken, refreshToken, loginError } = authState;

  // This will go soon, and we'll rely on the API responses
  const isAuthenticated = !!accessToken && !!refreshToken; // TODO

  const login = useCallback(async (codeResponse: CodeResponse) => {

    if (checkScopes(codeResponse.scope)) {
      const { accessToken, refreshToken } = await userLogin(codeResponse);

      setAuthState((prev: AuthState) => ({ ...prev, accessToken, refreshToken }));

      setLocalStorageItem('accessToken', accessToken);
      setLocalStorageItem('refreshToken', refreshToken);
    } else {
      setAuthState((prev: AuthState) => ({
        ...prev,
        accessToken: null,
        refreshToken: null,
        loginError: 'loginErrorInvalidScopes'
      }));
    }
  }, []);

  const logout = useCallback(async () => {
    // TODO: Call backend logout to invalidate tokens
    setLocalStorageItem('accessToken', null);
    setLocalStorageItem('refreshToken', null);

    setAuthState((prev: AuthState) => ({ ...prev, accessToken: null, refreshToken: null }));
  }, []);

  useEffect(() => {
    const accessToken = getLocalStorageItem('accessToken');
    const refreshToken = getLocalStorageItem('refreshToken');

    setAuthState((prev: AuthState) => ({ ...prev, accessToken, refreshToken }));
  }, []);

  return <AuthContext.Provider value={{ isAuthenticated, login, logout, loginError }}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContext => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
