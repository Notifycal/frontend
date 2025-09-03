import 'i18next';

import type { defaultNS } from '@common/i18n';

// If new translation files, import them
import type onboarding from '@assets/locales/es/onboarding.json';
import type translation from '@assets/locales/es/translation.json';

type TranslationsJSON = typeof translation;
type OnboardingJSON = typeof onboarding;

export type I18NJSON = TranslationsJSON | OnboardingJSON;

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: typeof defaultNS;
    resources: {
      onboarding: typeof onboarding;
      translation: typeof translation;
    };
  }
}
