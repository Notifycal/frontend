import type { TokenResponse } from '@react-oauth/google';
import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import type { FunctionComponent } from '../common/types';

export interface AuthContext {
  isAuthenticated: boolean;
  tokenResponse: TokenResponse;
  login: () => void;
}

const AuthContext = createContext<AuthContext | null>(null);

const key = 'isAuthenticated';

function getAuthenticationStatus(): boolean {
  return localStorage.getItem(key) == 'true';
}

function setAuthenticationStatus(authStatus: boolean): void {
  if (authStatus) {
    localStorage.setItem(key, `${authStatus}`);
  } else {
    localStorage.removeItem(key);
  }
}

const AuthProvider = ({ children }: {children: ReactNode}): FunctionComponent => {
  const [tokenResponse, setTokenResponse] = useState<TokenResponse | null>(null);
  const isAuthenticated = getAuthenticationStatus();


  // eslint-disable-next-line unicorn/prevent-abbreviations
  const login = useCallback((tokenRes: TokenResponse | null) => {
    if (tokenRes !== null) {
      setAuthenticationStatus(true);
      setTokenResponse(tokenRes);
    }
  }, []);

  return <AuthContext.Provider value={{ isAuthenticated, tokenResponse, login }}>{children}</AuthContext.Provider>;
};

export default AuthProvider;

export const useAuth = (): AuthContext | Error  => {
  const context = useContext(AuthContext);
  if (! context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
