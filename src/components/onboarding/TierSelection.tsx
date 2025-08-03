import { getServiceConfig } from '@config/serviceConfig';
import { tierOrder } from '@constants/tiers';
import type { LanguageCode } from '@notifycal/shared/types';
import { extendTierInfo } from '@services/tier';
import { useTranslation } from 'react-i18next';

import TierSelectionComponent from '../ui/TierSelection/TierSelection';

const TierSelection: React.FC = () => {
  const {
    TIER_INFO: { tiers }
  } = getServiceConfig();

  const { i18n } = useTranslation();
  const lang = i18n.language as LanguageCode;

  const orderedTierInfoWithIcons = tierOrder.map((tierId) => extendTierInfo(tierId, tiers, lang));

  return <TierSelectionComponent displayNavigationButtons orderedTierInfoWithIcons={orderedTierInfoWithIcons} />;
};

export default TierSelection;
