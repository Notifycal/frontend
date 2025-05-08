import 'i18next';

import type { defaultNS } from '@common/i18n';
import type { NestedKeyOf } from '@common/types';

import type onboarding from '@assets/locales/es/onboarding.json';
import type translations from '@assets/locales/es/translations.json';

type OnboardingKeys = NestedKeyOf<typeof onboarding>;
type TranslationKeys = NestedKeyOf<typeof translations>;

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: typeof defaultNS;
    resources: {
      onboarding: typeof onboarding;
      translations: typeof translations;
    };
  }

  type I18nKey = OnboardingKeys | TranslationKeys;
}
