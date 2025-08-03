import TierFeatures from '@components/ui/TierFeatures/TierFeatures';
import { Badge, Button, Card } from '@mantine/core';
import type { LanguageCode, Tier, TierId } from '@notifycal/shared/types';
import type { TablerIcon } from '@tabler/icons-react';
import clsx from 'clsx';
import type { FC } from 'react';

export interface TierInfo extends Tier {
  id: TierId;
  displayName: string;
  recommended?: boolean;
  features: Array<string>;
}

export type TierInfoWithIcon = TierInfo & { icon: TablerIcon };
interface TierCardProps {
  tier: TierInfoWithIcon;
  isLoading: boolean;
  isDisabled: boolean;
  onSelect: (tierId: TierId) => void;
  lang: LanguageCode;
}

import caTranslations from './tiercard-locales/ca.json' with { type: 'json' };
import enTranslations from './tiercard-locales/en.json' with { type: 'json' };
import esTranslations from './tiercard-locales/es.json' with { type: 'json' };

const translations = {
  en: enTranslations,
  es: esTranslations,
  ca: caTranslations
};

const TierCard: FC<TierCardProps> = ({ tier, isLoading, isDisabled, onSelect, lang }) => {
  const translation = translations[lang];
  return (
    <div key={tier.displayName}>
      {tier.recommended && (
        <div className="relative sm:mx-5 lg:mx-15">
          <Badge
            fullWidth
            className="absolute left-1/2 -translate-x-1/2 -top-5 z-10"
            color="yellow"
            radius="sm"
            size="lg"
            variant="filled"
          >
            {translation.popularBadge}
          </Badge>
        </div>
      )}
      <Card
        withBorder
        padding="lg"
        radius="md"
        shadow="md"
        className={clsx(
          'transition-transform h-full flex flex-col justify-between shadow-lg',
          tier.recommended
            ? 'hover:scale-[1.07] scale-105 bg-indigo-700 text-white border-indigo-600 shadow-xl hover:shadow-2xl transition-shadow duration-300'
            : 'hover:scale-[1.02] bg-white text-gray-900'
        )}
      >
        <div className="space-y-2">
          <div className="text-xl font-semibold">{tier.displayName}</div>
          <div className="text-sm opacity-80 min-h-[3.5rem] flex items-start justify-start">
            {translation.tierDescriptions[tier.id]}
          </div>

          <div className="flex justify-start items-baseline gap-1">
            <div className="text-4xl font-bold">{tier.priceEur}€</div>
            <div className="text-sm opacity-80">/{translation.month}</div>
          </div>
          <Button
            fullWidth
            color={tier.recommended ? 'dark' : 'blue'}
            disabled={isDisabled}
            loading={isLoading}
            mt="sm"
            variant={tier.recommended ? 'white' : 'outline'}
            onClick={() => {
              onSelect(tier.id);
            }}
          >
            {translation.selectButton}
          </Button>
          <TierFeatures className="min-h-[8rem]" tier={tier} />
        </div>
      </Card>
    </div>
  );
};

export default TierCard;
