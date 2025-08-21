import { getServiceConfig } from '@config/serviceConfig';
import { useCookieConsent } from '@hooks/useCookieConsent';
import { AuthProvider } from '@providers/AuthProvider';
import { GoogleOAuthProvider } from '@react-oauth/google';
import type { JSX, ReactNode } from 'react';

interface ConditionalAuthProviderProps {
  children: ReactNode;
}

export const ConditionalAuthProvider = ({ children }: ConditionalAuthProviderProps): JSX.Element => {
  const { GOOGLE_CLIENT_ID } = getServiceConfig();
  const { hasSecurityConsent } = useCookieConsent();
  if (!hasSecurityConsent) {
    return <>{children}</>;
  }
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthProvider>{children}</AuthProvider>
    </GoogleOAuthProvider>
  );
};
