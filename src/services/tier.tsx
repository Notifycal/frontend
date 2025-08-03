import type { TierInfoWithIcon } from '@notifycal/shared/components';
import type { LanguageCode, TierId } from '@notifycal/shared/types';
import { IconAward, IconMedal, IconTrophy } from '@tabler/icons-react';

import type { ProductsInfo } from '@config/pricing';
import caTranslations from './i18n/ca.json' with { type: 'json' };
import enTranslations from './i18n/en.json' with { type: 'json' };
import esTranslations from './i18n/es.json' with { type: 'json' };

const translations = {
  en: enTranslations,
  es: esTranslations,
  ca: caTranslations
};

const tierFeatures = (lang: LanguageCode, tierNumberOfReminders: number): Array<string> => [
  `${tierNumberOfReminders.toLocaleString(lang)} ${translations[lang].numberOfMonthlyReminders}`,
  translations[lang].googleCalendarIntegration
];

const tierExtraInfo = {
  good: {
    recommended: false,
    displayName: 'Solo',
    icon: IconMedal
  },
  better: {
    recommended: true,
    displayName: 'Team',
    icon: IconTrophy
  },
  best: {
    recommended: false,
    displayName: 'Pro',
    icon: IconAward
  }
};
export function extendTierInfo(tierId: TierId, tiersInfo: ProductsInfo['tiers'], lang: LanguageCode): TierInfoWithIcon {
  return {
    ...tiersInfo[tierId],
    ...tierExtraInfo[tierId],
    features: tierFeatures(lang, tiersInfo[tierId].numberOfReminders),
    id: tierId
  };
}
