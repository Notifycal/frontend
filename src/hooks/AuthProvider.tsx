import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';

import { login as apiLogin, createAuthInterceptor, createUnauthorizedInterceptor } from '@api/auth';
import { checkScopes, GOOGLE_OAUTH_SCOPES } from '@auth/google';
import usePromisifiedGoogleLogin from '@hooks/usePromisifiedGoogleLogin';

import { getLocalStorageItem, setLocalStorageItem } from '@common/utils';

import { setupRequestInterceptor, setupResponseInterceptor } from '@api/common';
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

  // Update localstorage whenever the state (tokens) changes
  // Using `useEffect` avoids having to call these functions along setAuthState
  useEffect(() => {
    setLocalStorageItem('accessToken', accessToken);
    setLocalStorageItem('refreshToken', refreshToken);
  }, [accessToken, refreshToken]);

  // Runs only once on mount, doesn't re-run on updates (because dependency array is empty).
  useEffect(() => {
    const accessToken = getLocalStorageItem('accessToken');
    const refreshToken = getLocalStorageItem('refreshToken');

    setAuthState((previous: AuthState) => ({ ...previous, accessToken, refreshToken }));
  }, []);

  const login = useCallback(async () => {
    // Reset loginError on new login
    setAuthState((previous: AuthState) => ({ ...previous, loginError: null }));

    try {
      const codeResponse = await googleLogin();

      if (checkScopes(codeResponse.scope)) {
        const { accessToken, refreshToken } = await apiLogin(codeResponse);

        setAuthState((previous: AuthState) => ({ ...previous, accessToken, refreshToken }));
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
    setAuthState((previous: AuthState) => ({ ...previous, accessToken: null, refreshToken: null }));
  }, []);

  useEffect(() => {
    // Setup axios interceptor for authentication when the access token changes
    if (accessToken) {
      const authInterceptor = createAuthInterceptor(accessToken);
      const requestInterceptor = setupRequestInterceptor(authInterceptor);

      // Cleanup by ejecting interceptor on component unmount
      return (): void => {
        requestInterceptor.eject();
      };
    }
  }, [accessToken]);

  useEffect(() => {
    // Setup axios interceptor for token refresh on 401 unauthorized
    if (refreshToken) {
      const unauthorizedInterceptor = createUnauthorizedInterceptor(
        refreshToken,
        // useCallback here?
        (newAccessToken, newRefreshToken): void => {
          setAuthState((previous) => ({
            ...previous,
            accessToken: newAccessToken,
            refreshToken: newRefreshToken
          }));
        }
      );
      const responseInterceptor = setupResponseInterceptor(unauthorizedInterceptor);

      // Cleanup by ejecting interceptor on component unmount
      return (): void => {
        responseInterceptor.eject();
      };
    }
  }, [refreshToken]);

  return <AuthContext.Provider value={{ isAuthenticated, login, logout, loginError }}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContext => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
