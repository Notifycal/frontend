import { useState, useEffect } from 'react';
import { CAT_SECURITY } from '@notifycal/shared/utils';
import * as CookieConsent from 'vanilla-cookieconsent';

export const useCookieConsent = (): { hasSecurityConsent: boolean } => {
  const [hasSecurityConsent, setHasSecurityConsent] = useState(false);

  useEffect((): (() => void) => {
    const checkConsent = (): void => {
      try {
        setHasSecurityConsent(CookieConsent.acceptedCategory(CAT_SECURITY));
      } catch {
        // Cookie consent not initialized yet
        setHasSecurityConsent(false);
      }
    };

    checkConsent();

    // Set up a recurring check since the library doesn't provide stable event listeners
    const interval = setInterval(checkConsent, 500);

    return (): void => {
      clearInterval(interval);
    };
  }, []);

  return { hasSecurityConsent };
};