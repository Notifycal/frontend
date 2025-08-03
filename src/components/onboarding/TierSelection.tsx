import type { LanguageCode, TierId } from '@notifycal/shared/types';

import type { FC } from 'react';

import TierCard, { type TierInfoWithIcon } from './TierCard';

interface TierSelectionProps {
  displayNavigationButtons?: boolean;
  orderedTierInfoWithIcons: Array<TierInfoWithIcon>;
  onTierSelection: (tierId: TierId) => Promise<void>;
  isCardButtonDisabled: (tierId: TierId) => boolean;
  isCardButtonLoading: (tierId: TierId) => boolean;
  lang: LanguageCode;
}

const TierSelection: FC<TierSelectionProps> = ({
  orderedTierInfoWithIcons,
  onTierSelection,
  isCardButtonDisabled,
  isCardButtonLoading,
  lang
}: TierSelectionProps) => {
  return (
    <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-6 lg:gap-12">
      {orderedTierInfoWithIcons.map((tier) => {
        return (
          <TierCard
            key={tier.id}
            isDisabled={isCardButtonDisabled(tier.id)}
            isLoading={isCardButtonLoading(tier.id)}
            lang={lang}
            tier={tier}
            onSelect={onTierSelection}
          />
        );
      })}
    </div>
  );
};

export default TierSelection;
