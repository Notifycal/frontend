import i18n, { type InitOptions, type TFunction } from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import translationEN from '@assets/locales/en/translations.json';
import translationES from '@assets/locales/es/translations.json';

import onboardingEN from '@assets/locales/en/onboarding.json';
import onboardingES from '@assets/locales/es/onboarding.json';

import flagEs from '@assets/icons/lang/es.png';
import flagGb from '@assets/icons/lang/gb.png';
import { isProduction } from '@common/utils';
import { languageByLanguageCode, phoneByCountry } from '@notifycal/shared/i18n';
import type { CountryCode, LanguageCode, LanguageData, PhoneData, PhoneNumber } from '@notifycal/shared/types';
import { deepmerge } from 'deepmerge-ts';

export type NotifycalI18nNamespaces = 'onboarding' | 'translations';
export type NotifycalTFunction = TFunction<NotifycalI18nNamespaces, undefined>;

export const defaultNS = 'translations';
export const resources = {
  en: {
    translations: translationEN,
    onboarding: onboardingEN
  },
  es: {
    translations: translationES,
    onboarding: onboardingES
  }
} as const;

const i18nOptions: InitOptions = {
  defaultNS,
  fallbackLng: 'en',
  debug: !isProduction,
  detection: {
    order: ['localStorage', 'navigator'],
    caches: ['localStorage']
  },
  resources,
  interpolation: {
    escapeValue: false // not needed for react as it escapes by default
  },
  react: {
    useSuspense: true
  }
};

const flagsByCountry: Record<CountryCode, Pick<PhoneData, 'image'>> = {
  ES: { image: flagEs },
  GB: { image: flagGb }
};

const flagsByLanguage: Record<LanguageCode, Pick<LanguageData, 'image'>> = {
  es: { image: flagEs },
  en: { image: flagGb }
};

export const languageData: Record<LanguageCode, LanguageData> = deepmerge(
  languageByLanguageCode,
  flagsByLanguage
) as Record<LanguageCode, LanguageData>;

export const phoneData: Record<CountryCode, PhoneData> = deepmerge(phoneByCountry, flagsByCountry) as Record<
  CountryCode,
  PhoneData
>;

void i18n.use(initReactI18next).use(LanguageDetector).init(i18nOptions);

export const isValidMobilePhoneNumber = (number: PhoneNumber, country: CountryCode): boolean => {
  const regex = phoneData[country].phoneDetails.numberMask;
  return regex.test(number);
};
