import type { TokenResponse } from '@react-oauth/google';
import { createContext, useCallback, useContext, useState } from 'react';
import type { FunctionComponent } from '../common/types';

const AuthContext = createContext({
  tokenResponse: null,
  login: () => {},
});

interface AuthProviderProps {
  children: React.ReactElement;
};

const AuthProvider = ({ children }: AuthProviderProps): FunctionComponent => {
  const [ tokenResponse, setTokenResponse ] = useState<TokenResponse | null>(null);

  // eslint-disable-next-line unicorn/prevent-abbreviations
  const login = useCallback((tokenRes: TokenResponse | null) => {
    if (tokenRes !== null) {
      setTokenResponse(tokenRes);
    }
  }, []);

  return (
    <AuthContext.Provider value={{tokenResponse, login}}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuth = () => {
  return useContext(AuthContext);
};
