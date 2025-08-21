import { createContext, useContext, useState, type JSX, type ReactNode } from 'react';

interface CookieConsentContextType {
  hasSecurityConsent: boolean;
  setHasSecurityConsent: (value: boolean) => void;
}

const CookieConsentContext = createContext<CookieConsentContextType | null>(null);

interface CookieConsentProviderProps {
  children: ReactNode;
}

export const CookieConsentProvider = ({ children }: CookieConsentProviderProps): JSX.Element => {
  const [hasSecurityConsent, setHasSecurityConsent] = useState(false);

  return (
    <CookieConsentContext.Provider value={{ hasSecurityConsent, setHasSecurityConsent }}>
      {children}
    </CookieConsentContext.Provider>
  );
};

export const useCookieConsent = (): CookieConsentContextType => {
  const context = useContext(CookieConsentContext);
  if (!context) {
    throw new Error('useCookieConsentContext must be used within a CookieConsentProvider');
  }
  return context;
};
