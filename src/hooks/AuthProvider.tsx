import type { CodeResponse } from '@react-oauth/google';
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';

import { userLogin } from '../auth/backend';
import { checkScopes } from '../auth/google';

import { sleep } from '../common/utils';

import type { FunctionComponent } from '../common/types';

export interface AuthContext {
  isAuthenticated: boolean;
  login: (codeResponse: CodeResponse) => Promise<void>;
  logout: () => Promise<void>;
  codeResponse: CodeResponse | null;
}

const AuthContext = createContext<AuthContext | null>(null);

const key = 'google.code.response';

function getStoredCodeResponse(): CodeResponse | null {
  const localStorageValue = localStorage.getItem(key);
  if (localStorageValue) {
    return JSON.stringify(localStorageValue) as unknown as CodeResponse;
  }

  return null;
}

function setStoredCodeResponse(codeResponse: CodeResponse | null): void {
  if (codeResponse) {
    localStorage.setItem(key, JSON.stringify(codeResponse));
  } else {
    localStorage.removeItem(key);
  }
}

export const AuthProvider = ({ children }: {children: ReactNode}): FunctionComponent => {
  const [codeResponse, setCodeResponse] = useState<CodeResponse | null>(getStoredCodeResponse());
  const isAuthenticated = !!codeResponse; // TODO

  const login = useCallback(async (codeResponse: CodeResponse) => {
    await sleep(500);

    if (checkScopes(codeResponse.scope)) {
      // All scopes are fiiine!
      setStoredCodeResponse(codeResponse);
      setCodeResponse(codeResponse);
      const foo = await userLogin(codeResponse);
      console.log(`foo: ${foo}`);
    } else {}


  }, []);

  const logout = useCallback(async () => {
    await sleep(250);

    setStoredCodeResponse(null);
    setCodeResponse(null);
  }, []);

  // TODO: Should use useEffect here?
  useEffect(() => {
    setCodeResponse(getStoredCodeResponse());
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, codeResponse, login, logout }}>
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
