import '@notifycal/shared/styles/cookie-consent-theme.css';
import type { LanguageCode } from '@notifycal/shared/types';
import { type PropsWithChildren, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { run, setLanguage } from 'vanilla-cookieconsent';
import 'vanilla-cookieconsent/dist/cookieconsent.css';
import { cookieConsentConfig } from './cookieConsentConfig';

const CookieConsentComponent: React.FC<PropsWithChildren> = ({ children }) => {
  const { i18n } = useTranslation();
  const lang = i18n.language as LanguageCode;

  useEffect(() => {
    document.body.classList.add('cc--theme');
    void setLanguage(lang);
    void run(cookieConsentConfig(lang));
  }, [lang]);

  return children;
};

export default CookieConsentComponent;
