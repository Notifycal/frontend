import { Legal } from '@components/ui/Legal/Legal';
import type { LanguageCode } from '@notifycal/shared/types';
import type { JSX } from 'react';
import { useTranslation } from 'react-i18next';

import { html as privacyEn } from '@assets/locales/en/privacy_policy.md';
import { html as privacyEs } from '@assets/locales/es/privacy_policy.md';

const privacyPolicyByLanguage: Record<LanguageCode, string> = {
  es: privacyEs,
  en: privacyEn,
  ca: privacyEs
};

export const PrivacyPolicy = (): JSX.Element => {
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language as LanguageCode;
  const privacyContent = privacyPolicyByLanguage[currentLanguage];

  return <Legal htmlText={privacyContent} />;
};
