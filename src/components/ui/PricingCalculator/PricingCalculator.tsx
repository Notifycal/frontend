import { Card, Group } from '@mantine/core';
import type { TierInfoWithIcon } from '@notifycal/shared/components';
import type { TierId } from '@notifycal/shared/types';
import { IconCalculator } from '@tabler/icons-react';
import { useState, type FC, type ReactElement } from 'react';
import { CalculatorInputSection } from './CalculatorInputSection';
import { CalculatorResultArea } from './CalculatorResultArea';
import { calculateTierRecommendation, type CalculationResult } from './calculatorUtils';
import { HideCalculatorButton } from './HideCalculatorButton';
import { ShowCalculatorButton } from './ShowCalculatorButton';

interface PricingCalculatorProps {
  orderedTierInfoWithIcons: Array<TierInfoWithIcon>;
  onTierRecommendation: (data: { tierId: TierId; trigger: number }) => void;
  onTierSelect: (tierId: TierId) => void;
  isSelectButtonLoading: boolean;
  collapsible?: boolean;
  defaultExpanded?: boolean;
  contactUrl?: string;
}

const PricingCalculator: FC<PricingCalculatorProps> = ({
  orderedTierInfoWithIcons,
  onTierRecommendation,
  onTierSelect,
  isSelectButtonLoading,
  collapsible = false,
  defaultExpanded = false,
  contactUrl = '/#/onboarding/feedback'
}) => {
  const [employees, setEmployees] = useState<number>(1);
  const [avgTimeWithClient, setAvgTimeWithClient] = useState<string>('60');
  const [workingHoursPerDay, setWorkingHoursPerDay] = useState<string>('8');
  const [workingDaysPerMonth, setWorkingDaysPerMonth] = useState<number>(22);
  const [calculationResult, setCalculationResult] = useState<CalculationResult | undefined>(undefined);
  const [isExpanded, setIsExpanded] = useState<boolean>(collapsible ? defaultExpanded : true);

  const minutesPerMessage = 5;
  const handleCalculate = (): void => {
    const result = calculateTierRecommendation({
      employees,
      avgTimeWithClient,
      workingHoursPerDay,
      workingDaysPerMonth,
      minutesPerMessage,
      orderedTierInfoWithIcons
    });
    setCalculationResult(result);
    onTierRecommendation({
      tierId: result.recommendedTier.id,
      trigger: Date.now()
    });
  };

  if (collapsible && !isExpanded) {
    return (
      <ShowCalculatorButton
        onExpand={() => {
          setIsExpanded(true);
        }}
      />
    );
  }

  return (
    <Card withBorder className="bg-white max-w-4xl mx-auto" padding="lg" radius="md" shadow="md">
      <Group gap="xs" justify="center" mb="md">
        <IconCalculator className="text-accent2-600 mb-2" size={30} />
        <h4 className="font-semibold">Calculadora de plan</h4>
      </Group>

      <CalculatorInputSection
        avgTimeWithClient={avgTimeWithClient}
        employees={employees}
        workingDaysPerMonth={workingDaysPerMonth}
        workingHoursPerDay={workingHoursPerDay}
        onAvgTimeWithClientChange={setAvgTimeWithClient}
        onCalculate={handleCalculate}
        onEmployeesChange={setEmployees}
        onWorkingDaysPerMonthChange={setWorkingDaysPerMonth}
        onWorkingHoursPerDayChange={setWorkingHoursPerDay}
      />

      <CalculatorResultArea
        calculationResult={calculationResult}
        contactUrl={contactUrl}
        isSelectButtonLoading={isSelectButtonLoading}
        minutesPerMessage={minutesPerMessage}
        onTierSelect={onTierSelect}
      />

      {collapsible && (
        <HideCalculatorButton
          onCollapse={() => {
            setIsExpanded(false);
          }}
        />
      )}
    </Card>
  );
};

export default PricingCalculator;
