import { Legal } from '@components/ui/Legal/Legal';
import type { LanguageCode } from '@notifycal/shared/types';
import type { JSX } from 'react';
import { useTranslation } from 'react-i18next';

import { html as termsEn } from '@assets/locales/en/terms_and_conditions.md';
import { html as termsEs } from '@assets/locales/es/terms_and_conditions.md';

const termsAndConditionsByLanguage: Record<LanguageCode, string> = {
  es: termsEs,
  en: termsEn,
  ca: termsEs
};

export const TermsAndConditions = (): JSX.Element => {
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language as LanguageCode;
  const termsContent = termsAndConditionsByLanguage[currentLanguage];

  return <Legal htmlText={termsContent} />;
};
