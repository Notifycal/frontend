import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';

import { userLogin } from '../auth/backend';
import { checkScopes, GOOGLE_OAUTH_SCOPES } from '../auth/google';
import usePromisifiedGoogleLogin from './usePromisifiedGoogleLogin';

import { getLocalStorageItem, setLocalStorageItem } from '../common/utils';

import type { FunctionComponent } from '../common/types';

type LoginError = 'loginErrorInvalidScopes' | 'loginErrorGeneric' | null;

export interface AuthContext {
  isAuthenticated: boolean;
  login: () => Promise<void>;
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

  const googleLogin = usePromisifiedGoogleLogin({
    flow: 'auth-code',
    scope: GOOGLE_OAUTH_SCOPES.join(' ')
  });

  const login = useCallback(async () => {
    try {
      const codeResponse = await googleLogin();

      if (checkScopes(codeResponse.scope)) {
        const { accessToken, refreshToken } = await userLogin(codeResponse);

        setAuthState((prev: AuthState) => ({ ...prev, accessToken, refreshToken }));

        setLocalStorageItem('accessToken', accessToken);
        setLocalStorageItem('refreshToken', refreshToken);
      } else {
        throw new Error('loginErrorInvalidScopes');
      }
    } catch (err) {
      const { message } = err as Error;
      const loginError = message === 'loginErrorInvalidScopes' ? message : 'loginErrorGeneric';

      setAuthState((prev: AuthState) => ({
        ...prev,
        accessToken: null,
        refreshToken: null,
        loginError
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
