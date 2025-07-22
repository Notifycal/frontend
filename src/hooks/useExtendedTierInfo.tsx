import { getServiceConfig } from '@config/serviceConfig';
// import { tierExtraInfo, tierFeatures } from '@constants/tiers';
import type { TierId } from '@notifycal/shared/types';
import { useMemo } from 'react';
import type { TierInfo } from '@components/onboarding/TierCard';
import { IconAward, IconMedal, IconTrophy, type TablerIcon } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import type { NotifycalTFunction } from '@common/i18n';

type TierInfoWithIcon = TierInfo & { icon: TablerIcon}

export const tierFeatures = (t: NotifycalTFunction, tierNumberOfReminders: number): Array<string> => [
    t('tierSelection.numberOfMonthlyReminders', { qty: tierNumberOfReminders.toLocaleString() }),
    t('tierSelection.googleCalendarIntegration')
  ];

export const tierExtraInfo = {
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

function useExtendedTierInfo(tierId: TierId | undefined): TierInfoWithIcon | undefined {
  const { t } = useTranslation('onboarding');
  const {
    TIER_INFO: { tiers }
  } = getServiceConfig();

  const extendedTierInfo = useMemo(() => {
    if (tierId) {
      return {
        ...tiers[tierId],
        ...tierExtraInfo[tierId],
        features: tierFeatures(t, tiers[tierId].numberOfReminders),
        id: tierId
      };
    } else {
      return undefined;
    }
  }, [tiers, tierId, t]);

  return extendedTierInfo;
}

export default useExtendedTierInfo;
