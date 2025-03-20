import i18n, { type InitOptions } from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend, { type HttpBackendOptions } from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';

import translationEN from '@assets/locales/en/translations.json';
import translationES from '@assets/locales/es/translations.json';

import flagEn from '@assets/icons/lang/en.png';
import flagEs from '@assets/icons/lang/es.png';
import { isProduction } from '@common/utils';
import { languageByLanguageCode, phoneByCountry } from '@notifycal/shared/i18n';
import type { CountryCode, LanguageCode, LanguageData, PhoneData, PhoneNumber } from '@notifycal/shared/types';
import { deepmerge } from 'deepmerge-ts';

export const defaultNS = 'translations';
export const resources = {
  en: { translations: translationEN },
  es: { translations: translationES }
} as const;

const i18nOptions: InitOptions<HttpBackendOptions> = {
  defaultNS,
  ns: [defaultNS],
  debug: !isProduction,
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false // not needed for react as it escapes by default
  },
  backend: {
    loadPath: isProduction ? 'locales/{{lng}}/translations.json' : 'src/assets/locales/{{lng}}/translations.json'
  }
};

const flagsByCountry: Record<CountryCode, Pick<PhoneData, 'image'>> = {
  ES: { image: flagEs },
  EN: { image: flagEn }
};

const flagsByLanguage: Record<LanguageCode, Pick<LanguageData, 'image'>> = {
  es: { image: flagEs },
  en: { image: flagEn }
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
