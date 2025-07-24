import { languageByLanguageCode, phoneByCountry } from '@notifycal/shared/i18n';
import type { CountryCode, LanguageCode, LanguageData, PhoneData, PhoneNumber } from '@notifycal/shared/types';

import i18n, { type InitOptions, type TFunction } from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend, { type HttpBackendOptions } from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';

import { isProduction } from '@common/utils';
import { deepmerge } from 'deepmerge-ts';

import flagCa from '@assets/icons/lang/ca.png';
import flagEs from '@assets/icons/lang/es.png';
import flagGb from '@assets/icons/lang/gb.png';

export type NotifycalI18nNamespaces = 'onboarding' | 'translations';
export type NotifycalTFunction = TFunction<NotifycalI18nNamespaces, undefined>;

export const defaultNS = 'translations';

const i18nOptions: InitOptions = {
  // https://github.com/i18next/i18next-http-backend?tab=readme-ov-file#seeing-failed-http-requests-like-404
  load: 'languageOnly',
  defaultNS,
  fallbackLng: 'en',
  debug: !isProduction,
  detection: {
    order: ['localStorage', 'navigator'],
    caches: ['localStorage']
  },
  interpolation: {
    escapeValue: false // not needed for react as it escapes by default
  },
  backend: {
    loadPath: isProduction ? 'locales/{{lng}}/{{ns}}.json' : 'src/assets/locales/{{lng}}/{{ns}}.json'
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
  en: { image: flagGb },
  ca: { image: flagCa }
};

export const languageData: Record<LanguageCode, LanguageData> = deepmerge(
  languageByLanguageCode,
  flagsByLanguage
) as Record<LanguageCode, LanguageData>;

export const phoneData: Record<CountryCode, PhoneData> = deepmerge(phoneByCountry, flagsByCountry) as Record<
  CountryCode,
  PhoneData
>;

void i18n.use(initReactI18next).use(LanguageDetector).use(Backend).init<HttpBackendOptions>(i18nOptions);

export const isValidMobilePhoneNumber = (number: PhoneNumber, country: CountryCode): boolean => {
  const regex = phoneData[country].phoneDetails.numberMask;
  return regex.test(number);
};
