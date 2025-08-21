import { getServiceConfig } from '@config/serviceConfig';
import { useCookieConsent } from '@hooks/useCookieConsent';
import { AuthProvider } from '@providers/AuthProvider';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { useEffect, useState, type JSX, type ReactNode } from 'react';

interface LazyGoogleOAuthProviderProps {
  children: ReactNode;
}

export const ConditionalGoogleOAuthProvider = ({ children }: LazyGoogleOAuthProviderProps): JSX.Element => {
  const { hasSecurityConsent } = useCookieConsent();
  const { GOOGLE_CLIENT_ID } = getServiceConfig();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (hasSecurityConsent) {
      setMounted(true);
    }
  }, [hasSecurityConsent]);

  // Only render GoogleOAuthProvider after user has given consent
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthProvider>{children}</AuthProvider>
    </GoogleOAuthProvider>
  );
};
