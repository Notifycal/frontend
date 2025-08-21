import '@notifycal/shared/styles/cookie-consent-theme.css';
import { type PropsWithChildren, useEffect } from 'react';
import { run } from 'vanilla-cookieconsent';
import 'vanilla-cookieconsent/dist/cookieconsent.css';
import { cookieConsentConfig } from './cookieConsentConfig';

const CookieConsentComponent: React.FC<PropsWithChildren> = ({ children }) => {
  useEffect(() => {
    document.body.classList.add('cc--theme');
    void run(cookieConsentConfig());
  }, []);

  return children;
};

export default CookieConsentComponent;
