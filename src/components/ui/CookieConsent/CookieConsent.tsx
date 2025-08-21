import '@notifycal/shared/styles/cookie-consent-theme.css';
import { CAT_SECURITY } from '@notifycal/shared/utils';
import { useCookieConsent } from '@providers/CookieConsentProvider';
import { type JSX, useEffect } from 'react';
import { acceptedCategory, run } from 'vanilla-cookieconsent';
import 'vanilla-cookieconsent/dist/cookieconsent.css';
import { cookieConsentConfig } from './cookieConsentConfig';

const CookieConsentComponent = (): JSX.Element => {
  const { setHasSecurityConsent } = useCookieConsent();

  useEffect(() => {
    document.body.classList.add('cc--theme');

    const handleConsentChange = (): void => {
      const newConsent = acceptedCategory(CAT_SECURITY);
      setHasSecurityConsent(newConsent);
    };

    const initialConsent = acceptedCategory(CAT_SECURITY);
    setHasSecurityConsent(initialConsent);

    const config = cookieConsentConfig(handleConsentChange);

    void run(config);
  }, [setHasSecurityConsent]);

  return <></>;
};

export default CookieConsentComponent;
