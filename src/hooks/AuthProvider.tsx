import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';

import { login as apiLogin, createAuthInterceptor, createUnauthorizedInterceptor, refresh } from '@api/auth';
import { checkScopes, GOOGLE_OAUTH_SCOPES } from '@auth/google';
import usePromisifiedGoogleLogin from '@hooks/usePromisifiedGoogleLogin';

import { getLocalStorageItem, setLocalStorageItem } from '@common/utils';

import { setupRequestInterceptor, setupResponseInterceptor, type InterceptorReturn } from '@api/common';

import type { FunctionComponent } from '@common/types';

import { getUserProfile } from '@api/userProfile';
import FullPageSpinner from '@components/ui/FullPageSpinner/FullPageSpinner';
import type { Email, UserId, UserStatus } from '@notifycal/shared/types';
import { useQuery } from '@tanstack/react-query';

export type LoginError = 'loginErrorInvalidScopes' | 'loginErrorGeneric';

export type AuthInfo = {
  userId: UserId;
  email: Email;
  userStatus: UserStatus;
};

export interface AuthContext {
  isAuthenticated: boolean;
  login: () => Promise<void>;
  logout: () => void;
  loginError: LoginError | null;
  authInfo: AuthInfo | null;
}

type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  loginError: LoginError | null;
  loginStatus: 'unauthorized' | 'loading' | 'success';
  authInfo: AuthInfo | null;
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

export const AuthProvider = ({ children }: { children: ReactNode }): FunctionComponent => {
  const [authState, setAuthState] = useState<AuthState>({
    accessToken: null,
    refreshToken: getLocalStorageItem('refreshToken'),
    loginError: null,
    loginStatus: 'loading',
    authInfo: null
  });

  const { accessToken, refreshToken, loginError, loginStatus, authInfo } = authState;

  const googleLogin = usePromisifiedGoogleLogin({
    flow: 'auth-code',
    scope: GOOGLE_OAUTH_SCOPES.join(' ')
  });

  const hasMounted = useRef(false);

  const { data: userProfile } = useQuery({
    queryKey: ['user-profile'],
    queryFn: getUserProfile,
    enabled: !!accessToken
  });

  const updateAuthInfo = useCallback(
    (token: string | null) => {
      if (!token) {
        return null;
      }

      const decoded = decodeToken(token);
      const userId = decoded?.userId;
      if (!userId || !userProfile) {
        return null;
      }
      return { ...decoded, userStatus: userProfile.userStatus };
    },
    [userProfile]
  );

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

    const refreshToken = getLocalStorageItem('refreshToken');

    const refreshTokenFromServer = async (): Promise<void> => {
      if (refreshToken) {
        const response = await refresh(refreshToken);
        const newAccessToken = response.accessToken;
        const newRefreshToken = response.refreshToken;

        setAuthState((previous: AuthState) => ({
          ...previous,
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
          loginStatus: 'success'
        }));
      } else {
        throw new Error('No refresh token available');
      }
    };

    // cannot use async functions from useEffect, must use Promise or IIFE
    refreshTokenFromServer().catch(() => {
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

      if (checkScopes(codeResponse.scope)) {
        const { accessToken, refreshToken } = await apiLogin(codeResponse);

        setAuthState((previous: AuthState) => ({
          ...previous,
          accessToken,
          refreshToken,
          loginStatus: 'success'
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
    setAuthState((previous: AuthState) => ({
      ...previous,
      accessToken: null,
      refreshToken: null,
      loginStatus: 'unauthorized',
      authInfo: null
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

  if (loginStatus === 'loading') {
    return <FullPageSpinner />;
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated: loginStatus === 'success', login, logout, loginError, authInfo }}>
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
