import 'i18next';

import type { defaultNS } from '@common/i18n';

// If new translation files, import them
import type onboarding from '@assets/locales/es/onboarding.json';
import type translations from '@assets/locales/es/translations.json';

type TranslationsJSON = typeof translations;
type OnboardingJSON = typeof onboarding;

export type I18NJSON = TranslationsJSON | OnboardingJSON;

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: typeof defaultNS;
    resources: {
      onboarding: typeof onboarding;
      translations: typeof translations;
    };
  }
}
