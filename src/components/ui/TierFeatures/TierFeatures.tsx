import type { TierInfo } from '@components/onboarding/TierCard';
import { IconCheck, type TablerIcon } from '@tabler/icons-react';
import clsx from 'clsx';
import type { FC } from 'react';

interface TierFeatures {
  tier: TierInfo;
  icon?: TablerIcon;
  className?: string;
}

const TierFeatures: FC<TierFeatures> = ({ tier, className, icon: Icon = IconCheck }) => {
  return (
    <ul className={clsx('mt-4 flex flex-col gap-2 items-start text-sm opacity-80 px-0', className)}>
      {tier.features.map((feature, index) => (
        <li key={index} className="flex items-start gap-2">
          <Icon />
          <span>{feature}</span>
        </li>
      ))}
    </ul>
  );
};

export default TierFeatures;
