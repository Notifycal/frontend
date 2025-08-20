import '@notifycal/shared/styles/cookie-consent-theme.css';
import { cookieConsentConfig } from './cookieConsentConfig';
import { type JSX, useEffect } from 'react';
import { run } from 'vanilla-cookieconsent';
import 'vanilla-cookieconsent/dist/cookieconsent.css';

const CookieConsentComponent = (): JSX.Element => {
  useEffect(() => {
    document.body.classList.add('cc--theme');
    void run(cookieConsentConfig());
  }, []);

  return <></>;
};

export default CookieConsentComponent;
