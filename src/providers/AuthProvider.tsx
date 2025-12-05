import { login as apiLogin, createAuthInterceptor, createUnauthorizedInterceptor, refresh } from '@api/auth';
import { setupRequestInterceptor, setupResponseInterceptor, type InterceptorReturn } from '@api/common';
import { checkScopes, GOOGLE_OAUTH_SCOPES } from '@auth/google';
import { getLocalStorageItem, setLocalStorageItem } from '@common/utils';
import usePromisifiedGoogleLogin from '@hooks/usePromisifiedGoogleLogin';
import type { Email, UserId } from '@notifycal/shared/types';
import { createContext, useCallback, useContext, useEffect, useRef, useState, type JSX, type ReactNode } from 'react';

export type LoginError = 'loginErrorInvalidScopes' | 'loginErrorGeneric';

export type AuthInfo = {
  userId: UserId;
  email: Email;
};

export interface AuthContext {
  isAuthenticated: boolean;
  isLoading: boolean;
  isReloading: boolean;
  login: () => Promise<void>;
  logout: () => void;
  loginError: LoginError | null;
  authInfo: AuthInfo | null;
  // These 2 are used to control things that should happen immediately after the user logs in.
  shouldHandlePostLoginFlow: boolean;
  setShouldHandlePostLoginFlow: (value: boolean) => void;
}

type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  loginError: LoginError | null;
  loginStatus: 'unauthorized' | 'loading' | 'success' | 'reloading';
  authInfo: AuthInfo | null;
  shouldHandlePostLoginFlow: boolean;
};

const AuthContext = createContext<AuthContext | null>(null);

const decodeToken = (token: string): { userId: UserId; email: Email } | null => {
  try {
    const payload = token.split('.')[1];
    const decodedPayload = atob(payload!);
    const parsed = JSON.parse(decodedPayload) as Partial<{ userId: UserId; email: Email }>;
    if (typeof parsed.userId === 'string' && typeof parsed.email === 'string') {
      return { userId: parsed.userId, email: parsed.email };
    }
    return null;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

export const AuthProvider = ({ children, onLogout }: { children: ReactNode; onLogout: () => void }): JSX.Element => {
  const [authState, setAuthState] = useState<AuthState>({
    accessToken: null,
    refreshToken: getLocalStorageItem('refreshToken'),
    loginError: null,
    loginStatus: 'loading',
    authInfo: null,
    shouldHandlePostLoginFlow: false
  });

  const { accessToken, refreshToken, loginError, loginStatus, authInfo, shouldHandlePostLoginFlow } = authState;

  const googleLogin = usePromisifiedGoogleLogin({
    flow: 'auth-code',
    scope: GOOGLE_OAUTH_SCOPES.join(' ')
  });

  const hasMounted = useRef(false);

  const updateAuthInfo = useCallback((token: string | null) => {
    if (!token) {
      return null;
    }

    const decoded = decodeToken(token);
    return decoded;
  }, []);

  const refreshTokenFromServer = async (refreshToken: string | null): Promise<void> => {
    if (refreshToken) {
      const response = await refresh(refreshToken);
      const newAccessToken = response.accessToken;
      const newRefreshToken = response.refreshToken;

      setAuthState((previous: AuthState) => ({
        ...previous,
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        loginStatus: 'success',
        shouldHandlePostLoginFlow: false
      }));
    } else {
      throw new Error('No refresh token available');
    }
  };

  // Update localstorage whenever the state (tokens) changes
  // Using `useEffect` avoids having to call these functions along setAuthState
  useEffect(() => {
    setLocalStorageItem('refreshToken', refreshToken);
  }, [refreshToken]);

  useEffect(() => {
    if (accessToken) {
      const newAuthInfo = updateAuthInfo(accessToken);
      if (newAuthInfo) {
        setAuthState((previous) => ({ ...previous, authInfo: newAuthInfo }));
      }
    } else {
      setAuthState((previous) => ({ ...previous, authInfo: null }));
    }
  }, [accessToken, updateAuthInfo]);

  // Runs only once on mount, doesn't re-run on updates (because dependency array is empty).
  useEffect(() => {
    if (hasMounted.current) {
      return; // Skip if already mounted
    }

    hasMounted.current = true;

    setAuthState((previous: AuthState) => ({ ...previous, loginStatus: 'reloading' }));

    const refreshToken = getLocalStorageItem('refreshToken');

    // cannot use async functions from useEffect, must use Promise or IIFE
    refreshTokenFromServer(refreshToken).catch(() => {
      // this catches both a failed request, as well as a missing refresh token
      setAuthState((previous: AuthState) => ({
        ...previous,
        accessToken: null,
        refreshToken: null,
        loginStatus: 'unauthorized'
      }));
    });
  }, []);

  const login = useCallback(async () => {
    // Reset loginError on new login
    setAuthState((previous: AuthState) => ({ ...previous, loginError: null }));

    try {
      const codeResponse = await googleLogin();

      setAuthState((previous: AuthState) => ({ ...previous, loginStatus: 'loading' }));

      if (checkScopes(codeResponse.scope)) {
        const { accessToken, refreshToken } = await apiLogin(codeResponse);

        setAuthState((previous: AuthState) => ({
          ...previous,
          accessToken,
          refreshToken,
          loginStatus: 'success',
          shouldHandlePostLoginFlow: true
        }));
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
    onLogout();
    setAuthState((previous: AuthState) => ({
      ...previous,
      accessToken: null,
      refreshToken: null,
      loginStatus: 'unauthorized',
      authInfo: null
    }));
  }, [onLogout]);

  const setShouldHandlePostLoginFlow = useCallback((value: boolean) => {
    setAuthState((previous: AuthState) => ({
      ...previous,
      shouldHandlePostLoginFlow: value
    }));
  }, []);

  const accessTokenRef = useRef(accessToken);

  useEffect(() => {
    accessTokenRef.current = accessToken;
  }, [accessToken]);

  // Interceptors
  useEffect(() => {
    // Setup axios interceptor for authentication when the access token changes
    const authInterceptor = createAuthInterceptor(() => accessTokenRef.current);
    const requestInterceptor = setupRequestInterceptor(authInterceptor);

    return (): void => {
      // Cleanup by ejecting interceptor on component unmount
      if (requestInterceptor) {
        requestInterceptor.eject();
      }
    };
  }, []);

  useEffect(() => {
    // Setup axios interceptor for token refresh on 401 unauthorized
    let responseInterceptor: InterceptorReturn;

    if (refreshToken) {
      const unauthorizedInterceptor = createUnauthorizedInterceptor(
        refreshToken,
        // useCallback here?
        (newAccessToken, newRefreshToken, success): void => {
          setAuthState((previous) => ({
            ...previous,
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
            loginStatus: success ? 'success' : 'unauthorized'
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

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: loginStatus === 'success',
        isLoading: loginStatus === 'loading',
        isReloading: loginStatus === 'reloading',
        login,
        logout,
        loginError,
        authInfo,
        shouldHandlePostLoginFlow,
        setShouldHandlePostLoginFlow
      }}
    >
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
