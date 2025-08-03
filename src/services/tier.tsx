import type { NotifycalTFunction } from '@common/i18n';
import { getServiceConfig } from '@config/serviceConfig';
import type { TierInfoWithIcon } from '@notifycal/shared/components';
import type { TierId } from '@notifycal/shared/types';
import { IconAward, IconMedal, IconTrophy } from '@tabler/icons-react';

const tierFeatures = (t: NotifycalTFunction, tierNumberOfReminders: number): Array<string> => [
  t('tierSelection.numberOfMonthlyReminders', { qty: tierNumberOfReminders.toLocaleString() }),
  t('tierSelection.googleCalendarIntegration')
];

const tierExtraInfo = {
  good: {
    recommended: false,
    displayName: 'Solo',
    features: tierFeatures,
    icon: IconMedal
  },
  better: {
    recommended: true,
    displayName: 'Team',
    features: tierFeatures,
    icon: IconTrophy
  },
  best: {
    recommended: false,
    displayName: 'Pro',
    features: tierFeatures,
    icon: IconAward
  }
};
export function extendTierInfo(tierId: TierId, t: NotifycalTFunction): TierInfoWithIcon {
  const {
    TIER_INFO: { tiers }
  } = getServiceConfig();

  return {
    ...tiers[tierId],
    ...tierExtraInfo[tierId],
    features: tierFeatures(t, tiers[tierId].numberOfReminders),
    id: tierId
  };
}
