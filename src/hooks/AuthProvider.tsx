import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';

import { login as apiLogin, createAuthInterceptor, createUnauthorizedInterceptor, refresh } from '@api/auth';
import { checkScopes, GOOGLE_OAUTH_SCOPES } from '@auth/google';
import usePromisifiedGoogleLogin from '@hooks/usePromisifiedGoogleLogin';

import { getLocalStorageItem, setLocalStorageItem } from '@common/utils';

import { setupRequestInterceptor, setupResponseInterceptor, type InterceptorReturn } from '@api/common';

import type { FunctionComponent } from '@common/types';

import { Loader } from '@mantine/core';

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
  loginStatus: 'unauthorized' | 'loading' | 'success';
};

const AuthContext = createContext<AuthContext | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }): FunctionComponent => {
  const [authState, setAuthState] = useState<AuthState>({
    accessToken: null,
    refreshToken: getLocalStorageItem('refreshToken'),
    loginError: null,
    loginStatus: 'loading'
  });

  const { accessToken, refreshToken, loginError, loginStatus } = authState;

  const googleLogin = usePromisifiedGoogleLogin({
    flow: 'auth-code',
    scope: GOOGLE_OAUTH_SCOPES.join(' ')
  });

  const hasMounted = useRef(false);

  // Update localstorage whenever the state (tokens) changes
  // Using `useEffect` avoids having to call these functions along setAuthState
  useEffect(() => {
    setLocalStorageItem('refreshToken', refreshToken);
  }, [refreshToken]);

  // Runs only once on mount, doesn't re-run on updates (because dependency array is empty).
  useEffect(() => {
    if (hasMounted.current) {
      return; // Skip if already mounted
    }

    hasMounted.current = true;

    const refreshToken = getLocalStorageItem('refreshToken');

    const refreshTokenFromServer = async (): Promise<void> => {
      let newAccessToken: string | null = null;
      let newRefreshToken: string | null = null;
      let refreshSuccess = false;

      if (refreshToken) {
        const response = await refresh(refreshToken);
        newAccessToken = response.accessToken;
        newRefreshToken = response.refreshToken;
        refreshSuccess = true;
      }

      setAuthState((previous: AuthState) => ({
        ...previous,
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        loginStatus: refreshSuccess ? 'success' : 'unauthorized'
      }));
    };

    // cannot use async functions from useEffect, must use Promise or IIFE
    refreshTokenFromServer().catch((error) => {
      console.log('Error refreshing the token on page load:', error);
    });
  }, []);

  const login = useCallback(async () => {
    // Reset loginError on new login
    setAuthState((previous: AuthState) => ({ ...previous, loginError: null }));

    try {
      const codeResponse = await googleLogin();

      if (checkScopes(codeResponse.scope)) {
        const { accessToken, refreshToken } = await apiLogin(codeResponse);

        setAuthState((previous: AuthState) => ({ ...previous, accessToken, refreshToken, loginStatus: 'success' }));
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
        loginStatus: 'unauthorized',
        loginError
      }));
    }
  }, [googleLogin]);

  const logout = useCallback(() => {
    // TODO: Call backend logout to invalidate tokens
    setAuthState((previous: AuthState) => ({
      ...previous,
      accessToken: null,
      refreshToken: null,
      loginStatus: 'unauthorized'
    }));
  }, []);

  useEffect(() => {
    // Setup axios interceptor for authentication when the access token changes
    let requestInterceptor: InterceptorReturn;

    if (accessToken) {
      const authInterceptor = createAuthInterceptor(accessToken);
      requestInterceptor = setupRequestInterceptor(authInterceptor);
    }

    return (): void => {
      // Cleanup by ejecting interceptor on component unmount
      if (requestInterceptor) {
        requestInterceptor.eject();
      }
    };
  }, [accessToken]);

  useEffect(() => {
    // Setup axios interceptor for token refresh on 401 unauthorized
    let responseInterceptor: InterceptorReturn;

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
      responseInterceptor = setupResponseInterceptor(unauthorizedInterceptor);
    }

    return (): void => {
      // Cleanup by ejecting interceptor on component unmount
      if (responseInterceptor) {
        responseInterceptor.eject();
      }
    };
  }, [refreshToken]);

  if (loginStatus === 'loading') {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
        <Loader color="white" size="xl"/>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated: loginStatus === 'success', login, logout, loginError }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContext => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
