import i18n, { type InitOptions } from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend, { type HttpBackendOptions } from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';

import translationEN from '@assets/locales/en/translations.json';
import translationES from '@assets/locales/es/translations.json';

import flagEn from '@assets/icons/lang/en.png';
import flagEs from '@assets/icons/lang/es.png';

import { isProduction } from '@common/utils';
import type { PhoneNumber } from '@notifycal/shared/types';

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

void i18n.use(initReactI18next).use(LanguageDetector).use(Backend).init<HttpBackendOptions>(i18nOptions);


export type LanguageCode = 'en' | 'es';

type Language = 'English' | 'Spanish';
type Country = 'Spain' | 'United Kingdom';

export type LanguageData = {
  label: Language;
  image: string;
  code: LanguageCode;
};

type CountryPhoneDetails = {
  dialCode: string; // Apply regex here?
  numberMask: RegExp;  // Apply regex here?
};

export type CountryData = {
  label: Country;
  image: string;
  code: LanguageCode;
  phoneDetails: CountryPhoneDetails
  // dialCode: string;
};

export const languageData: Record<LanguageCode, LanguageData> = {
  es: { label: 'Spanish', code: 'es', image: flagEs },
  en: { label: 'English', code: 'en', image: flagEn }
};

export const countryData: Record<LanguageCode, CountryData> = {
  es: { label: 'Spain', code: 'es', image: flagEs, phoneDetails: {numberMask: /^(?:\+34\s?)?[67]\d{8}$/, dialCode: '+34' }},
  en: { label: 'United Kingdom', code: 'en', image: flagEn, phoneDetails: {numberMask: /^(?:\+44\s?|0)7\d{9}$/, dialCode: '+44' }}
};

export const isValidMobilePhoneNumber = (number: PhoneNumber, country: LanguageCode): boolean => {
  const regex = countryData[country].phoneDetails.numberMask;
  return regex.test(number);
}
