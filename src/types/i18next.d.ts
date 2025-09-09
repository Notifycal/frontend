import 'i18next';

import type { defaultNS } from '@common/i18n';

// If new translation files, import them
import type onboarding from '@assets/locales/es/onboarding.json';
import type translation from '@assets/locales/es/translation.json';
import type faq from '@assets/locales/es/faq.json';

type TranslationsJSON = typeof translation;
type OnboardingJSON = typeof onboarding;
type FaqJSON = typeof faq;

export type I18NJSON = TranslationsJSON | OnboardingJSON | FaqJSON;

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: typeof defaultNS;
    resources: {
      onboarding: typeof onboarding;
      translation: typeof translation;
      faq: typeof faq;
    };
  }
}
