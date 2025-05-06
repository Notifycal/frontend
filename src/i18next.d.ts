import 'i18next';

import type { defaultNS } from '@common/i18n';

import type onboarding from '@assets/locales/es/onboarding.json';
import type translations from '@assets/locales/es/translations.json';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: typeof defaultNS;
    resources: {
      onboarding: typeof onboarding;
      translations: typeof translations;
    };
  }
}
