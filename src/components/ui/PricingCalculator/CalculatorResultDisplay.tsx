import { Text } from '@mantine/core';
import type { TierId } from '@notifycal/shared/types';
import { IconCalculator } from '@tabler/icons-react';
import type { ReactElement } from 'react';
import type { CalculationResult } from './calculatorUtils';
import { Action, Arrow, MonthlyEstimateAndMetrics } from './ResultComponents';

export const CalculatorStandbyDisplayContent = (): ReactElement => (
  <div className="text-gray-500 py-2 text-center">
    <IconCalculator className="mx-auto mb-1 opacity-50" size={24} />
    <Text size="xs">Calcula para ver tu recomendación</Text>
  </div>
);

interface CalculatorResultDisplayProps {
  layoutType: 'desktop' | 'mobile';
  data: CalculationResult;
  minutesPerMessage: number;
  isSelectButtonLoading: boolean;
  contactUrl: string;
  onTierSelect: (tierId: TierId) => void;
}

export const CalculatorResultDisplay = ({
  layoutType,
  data,
  minutesPerMessage,
  isSelectButtonLoading,
  contactUrl,
  onTierSelect
}: CalculatorResultDisplayProps): ReactElement => {
  const layoutConfigs = {
    desktop: {
      container: 'hidden md:grid md:grid-cols-12 items-center',
      arrow: 'horizontal' as const
    },
    mobile: {
      container: 'md:hidden space-y-4',
      arrow: 'vertical' as const
    }
  };
  const config = layoutConfigs[layoutType];

  const { monthlyMessages, recommendedTier, exceedsTopTier, savedHours } = data;
  const estimateAndMetrics = MonthlyEstimateAndMetrics(monthlyMessages, savedHours, minutesPerMessage, exceedsTopTier);
  const actionButton = (
    <Action
      contactUrl={contactUrl}
      isSelectButtonLoading={isSelectButtonLoading}
      tier={recommendedTier ?? undefined}
      type={exceedsTopTier ? 'contact' : 'tier'}
      onTierSelect={onTierSelect}
    />
  );

  return (
    <div className={config.container}>
      {estimateAndMetrics}
      {Arrow(config.arrow)}
      {actionButton}
    </div>
  );
};
