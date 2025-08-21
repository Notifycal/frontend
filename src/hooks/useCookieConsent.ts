import { CAT_SECURITY } from '@notifycal/shared/utils';
import { useEffect, useState } from 'react';
import { acceptedCategory } from 'vanilla-cookieconsent';

export const useCookieConsent = (): { hasSecurityConsent: boolean } => {
  const [hasSecurityConsent, setHasSecurityConsent] = useState(false);

  useEffect(() => {
    const checkConsent = (): void => {
      try {
        setHasSecurityConsent(acceptedCategory(CAT_SECURITY));
      } catch {
        setHasSecurityConsent(false);
      }
    };

    checkConsent();

    const interval = setInterval(checkConsent, 500);

    return (): void => {
      clearInterval(interval);
    };
  }, []);

  return { hasSecurityConsent };
};
