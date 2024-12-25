import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';

import { userLogin } from '@auth/backend';
import { checkScopes, GOOGLE_OAUTH_SCOPES } from '@auth/google';
import usePromisifiedGoogleLogin from '@hooks/usePromisifiedGoogleLogin';

import { getLocalStorageItem, setLocalStorageItem } from '@common/utils';

import type { FunctionComponent } from '@common/types';

export type LoginError = 'loginErrorInvalidScopes' | 'loginErrorGeneric' | null;

export interface AuthContext {
  isAuthenticated: boolean;
  login: () => Promise<void>;
  logout: () => void;
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
    // Reset loginError on new login
    setAuthState((previous: AuthState) => ({ ...previous, loginError: null }));

    try {
      const codeResponse = await googleLogin();

      if (checkScopes(codeResponse.scope)) {
        const { accessToken, refreshToken } = await userLogin(codeResponse);

        setAuthState((previous: AuthState) => ({ ...previous, accessToken, refreshToken }));

        setLocalStorageItem('accessToken', accessToken);
        setLocalStorageItem('refreshToken', refreshToken);
      } else {
        throw new Error('loginErrorInvalidScopes');
      }
    } catch (error) {
      const { message } = error as Error;
      const loginError = message === 'loginErrorInvalidScopes' ? message : 'loginErrorGeneric';

      setAuthState((previous: AuthState) => ({
        ...previous,
        accessToken: null,
        refreshToken: null,
        loginError
      }));
    }
  }, [googleLogin]);

  const logout = useCallback(() => {
    // TODO: Call backend logout to invalidate tokens
    setLocalStorageItem('accessToken', null);
    setLocalStorageItem('refreshToken', null);

    setAuthState((previous: AuthState) => ({ ...previous, accessToken: null, refreshToken: null }));
  }, []);

  useEffect(() => {
    const accessToken = getLocalStorageItem('accessToken');
    const refreshToken = getLocalStorageItem('refreshToken');

    setAuthState((previous: AuthState) => ({ ...previous, accessToken, refreshToken }));
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
