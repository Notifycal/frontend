import { getServiceConfig } from '@config/serviceConfig';
import type { LanguageCode } from '@notifycal/shared/types';
import { useTranslation } from 'react-i18next';

import { orderedTierInfoWithIcons } from '@notifycal/shared/pricing';
import TierSelectionComponent from '../ui/TierSelection/TierSelection';

const TierSelection: React.FC = () => {
  const {
    TIER_INFO: { tiers }
  } = getServiceConfig();

  const { i18n } = useTranslation();
  const lang = i18n.language as LanguageCode;

  return (
    <TierSelectionComponent displayNavigationButtons orderedTierInfoWithIcons={orderedTierInfoWithIcons(tiers, lang)} />
  );
};

export default TierSelection;
