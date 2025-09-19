import { Button, Card, Group, NumberInput, Select, Text } from '@mantine/core';
import type { TierInfoWithIcon } from '@notifycal/shared/components';
import type { TierId } from '@notifycal/shared/types';
import {
  IconArrowRight,
  IconCalculator,
  IconChartBar,
  IconChevronDown,
  IconChevronUp,
  IconClock
} from '@tabler/icons-react';
import { useState, type FC, type ReactElement } from 'react';

interface PricingCalculatorProps {
  orderedTierInfoWithIcons: Array<TierInfoWithIcon>;
  onTierRecommendation: (data: { tierId: TierId; trigger: number }) => void;
  onTierSelect: (tierId: TierId) => void;
  isSelectButtonLoading: boolean;
  collapsible?: boolean;
  defaultExpanded?: boolean;
}

interface CalculationResult {
  monthlyMessages: number;
  recommendedTier: TierInfoWithIcon;
  exceedsTopTier: boolean;
  savedHours: number;
}

const PricingCalculator: FC<PricingCalculatorProps> = ({
  orderedTierInfoWithIcons,
  onTierRecommendation,
  onTierSelect,
  isSelectButtonLoading,
  collapsible = false,
  defaultExpanded = false
}) => {
  const [employees, setEmployees] = useState<number>(1);
  const [avgTimeWithClient, setAvgTimeWithClient] = useState<string>('60');
  const [workingHoursPerDay, setWorkingHoursPerDay] = useState<string>('8');
  const [workingDaysPerMonth, setWorkingDaysPerMonth] = useState<number>(22);
  const [calculationResult, setCalculationResult] = useState<CalculationResult | undefined>(undefined);
  const [isExpanded, setIsExpanded] = useState<boolean>(collapsible ? defaultExpanded : true);

  const minutesPerMessage = 5;

  const timeOptions = [
    { value: '10', label: '10 min' },
    { value: '15', label: '15 min' },
    { value: '20', label: '20 min' },
    { value: '30', label: '30 min' },
    { value: '45', label: '45 min' },
    { value: '60', label: '1 hora' },
    { value: '75', label: '1.25 horas' },
    { value: '90', label: '1.5 horas' },
    { value: '105', label: '1.75 horas' },
    { value: '120', label: '2 horas' },
    { value: '150', label: '2.5 horas' },
    { value: '180', label: '3 horas' },
    { value: '240', label: '4 horas' },
    { value: '300', label: '5 horas' },
    { value: '360', label: '6 horas' },
    { value: '480', label: '8 horas' }
  ];

  const workingHoursOptions = [
    { value: '4', label: '4 horas' },
    { value: '5', label: '5 horas' },
    { value: '6', label: '6 horas' },
    { value: '6.5', label: '6.5 horas' },
    { value: '7', label: '7 horas' },
    { value: '7.5', label: '7.5 horas' },
    { value: '8', label: '8 horas' },
    { value: '8.5', label: '8.5 horas' },
    { value: '9', label: '9 horas' },
    { value: '10', label: '10 horas' },
    { value: '12', label: '12 horas' }
  ];

  const calculateTierRecommendation = (): CalculationResult => {
    const avgTimeInHours = Number(avgTimeWithClient) / 60;
    const hoursPerDay = Number(workingHoursPerDay);
    const appointmentsPerEmployeePerDay = hoursPerDay / avgTimeInHours;
    const totalAppointmentsPerDay = appointmentsPerEmployeePerDay * employees;
    const monthlyMessages = Math.ceil(totalAppointmentsPerDay * workingDaysPerMonth);

    const totalMinutesSaved = monthlyMessages * minutesPerMessage;
    const savedHours = Math.round((totalMinutesSaved / 60) * 10) / 10;

    const sortedTiers = [...orderedTierInfoWithIcons].sort((a, b) => a.numberOfReminders - b.numberOfReminders);
    const topTier = sortedTiers[sortedTiers.length - 1];
    const maxTierLimit = topTier?.numberOfReminders || 0;

    const exceedsTopTier = monthlyMessages > maxTierLimit;
    const recommendedTier = sortedTiers.find((tier) => monthlyMessages <= tier.numberOfReminders) ?? topTier!;

    return {
      monthlyMessages,
      recommendedTier,
      exceedsTopTier,
      savedHours
    };
  };

  const handleCalculate = (): void => {
    const result = calculateTierRecommendation();
    setCalculationResult(result);
    onTierRecommendation({
      tierId: result.recommendedTier.id,
      trigger: Date.now()
    });
  };

  const MonthlyEstimateAndMetrics = (
    monthlyMessages: number,
    savedHours: number,
    isContactUs = false
  ): ReactElement => (
    <div className="space-y-1 md:col-span-6">
      <div className="p-1 px-4 flex items-center gap-3">
        <IconChartBar className="ml-1 text-accent2-600 hidden xs:inline-block" size={20} />
        <div>
          <div className="text-lg font-semibold text-gray-800">
            {monthlyMessages}
            {isContactUs ? '+' : ''} mensajes / mes
          </div>
          <div className="text-xs text-gray-400">Tu estimación mensual</div>
        </div>
      </div>
      <div className="p-1 px-4 flex items-center gap-3">
        <IconClock className="ml-2 hidden xs:inline-block" size={16} />
        <div>
          <div className="text-sm text-gray-700">
            <span>
              {monthlyMessages} mensajes × {minutesPerMessage} minutos =
            </span>
            <span className="font-semibold"> {savedHours} h ahorradas</span>
          </div>
          <div className="text-xs text-gray-400">Basado en {minutesPerMessage} minutos por mensaje manual</div>
        </div>
      </div>
    </div>
  );

  const Arrow = (orientation: 'horizontal' | 'vertical' = 'horizontal'): ReactElement => (
    <div
      className={
        orientation === 'horizontal'
          ? 'col-span-1 text-center flex flex-col items-center justify-center h-full'
          : 'text-center'
      }
    >
      <IconArrowRight
        className={`text-accent2-300 ${orientation === 'vertical' ? 'mx-auto rotate-90' : ''}`}
        size={orientation === 'horizontal' ? 58 : 32}
      />
    </div>
  );

  const Action = (type: 'contact' | 'tier', tier: TierInfoWithIcon): ReactElement => {
    const baseProps = {
      className: 'w-full md:w-auto md:min-w-62 text-sm md:text-xl py-4 font-bold',
      size: 'xl' as const,
      variant: 'filled' as const
    };

    const contactProps = {
      ...baseProps,
      color: 'accent2' as const,
      component: 'a' as const,
      href: '/#/onboarding/feedback'
    };

    const tierProps = {
      ...baseProps,
      color: 'primary' as const,
      loading: isSelectButtonLoading,
      onClick: (): void => {
        onTierSelect(tier.id);
      }
    };

    return (
      <div className="mx-auto text-center md:col-span-5">
        <Button {...(type === 'contact' ? contactProps : tierProps)}>
          {type === 'contact' ? (
            <span>Contactar</span>
          ) : (
            <>
              <span className="md:hidden">Plan {tier?.displayName}</span>
              <span className="hidden md:inline">Seleccionar Plan {tier?.displayName}</span>
            </>
          )}
        </Button>
        {type === 'contact' && (
          <Text className="text-gray-600 mt-2" size="xs">
            No te preocupes, ponte en contacto con nosotros y encontraremos una solución
          </Text>
        )}
      </div>
    );
  };

  const CalculatorStandbyDisplayContent = (): ReactElement => (
    <div className="text-gray-500 py-2 text-center">
      <IconCalculator className="mx-auto mb-1 opacity-50" size={24} />
      <Text size="xs">Calcula para ver tu recomendación</Text>
    </div>
  );

  const CalculatorResultDisplay = ({
    layoutType,
    data
  }: {
    layoutType: 'desktop' | 'mobile';
    data: CalculationResult;
  }): ReactElement => {
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
    const estimateAndMetrics = MonthlyEstimateAndMetrics(monthlyMessages, savedHours, exceedsTopTier);
    const actionButton = Action(exceedsTopTier ? 'contact' : 'tier', recommendedTier ?? undefined);

    return (
      <div className={config.container}>
        {estimateAndMetrics}
        {Arrow(config.arrow)}
        {actionButton}
      </div>
    );
  };

  const CalculatorInputSection = (): ReactElement => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
      <NumberInput
        className="w-full md:order-1"
        label="Empleados"
        max={100}
        min={1}
        value={employees}
        onChange={(value) => {
          setEmployees(Number(value) || 1);
        }}
      />
      <Select
        className="w-full md:order-2"
        data={timeOptions}
        label="Tiempo con cliente"
        value={avgTimeWithClient}
        onChange={(value) => {
          setAvgTimeWithClient(value || '60');
        }}
      />
      <Select
        className="w-full md:order-4"
        data={workingHoursOptions}
        label="Jornada"
        value={workingHoursPerDay}
        onChange={(value) => {
          setWorkingHoursPerDay(value || '8');
        }}
      />
      <NumberInput
        className="w-full md:order-5"
        label="Días laborables"
        max={31}
        min={1}
        value={workingDaysPerMonth}
        onChange={(value) => {
          setWorkingDaysPerMonth(Number(value) || 22);
        }}
      />
      <div className="md:order-3 md:row-span-2 flex items-center md:py-1 md:pt-6 md:pl-4">
        <Button
          className="w-full h-full md:min-h-[90px] text-lg md:text-xl font-bold py-4 md:py-0"
          color="accent2"
          size="lg"
          variant="outline"
          onClick={handleCalculate}
        >
          Calcular
        </Button>
      </div>
    </div>
  );

  const Calculator = (): ReactElement => (
    <Card withBorder className="bg-white max-w-4xl mx-auto" padding="lg" radius="md" shadow="md">
      <Group gap="xs" justify="center" mb="md">
        <IconCalculator className="text-accent2-600 mb-2" size={30} />
        <h4 className="font-semibold">Calculadora de plan</h4>
      </Group>

      {CalculatorInputSection()}

      <div className="mt-6 p-4 border border-gray-400 rounded-lg min-h-[200px] flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 shadow-inner">
        {!calculationResult ? (
          <CalculatorStandbyDisplayContent />
        ) : (
          <div className="w-full">
            <CalculatorResultDisplay data={calculationResult} layoutType="desktop" />
            <CalculatorResultDisplay data={calculationResult} layoutType="mobile" />
          </div>
        )}
      </div>

      {collapsible && (
        <div className="mt-4 text-center">
          <Button
            className="text-gray-600 hover:underline"
            size="sm"
            variant="transparent"
            onClick={() => {
              setIsExpanded(false);
            }}
          >
            <IconChevronUp className="mr-2" size={20} />
            <span>Ocultar calculadora</span>
            <IconChevronUp className="ml-2" size={20} />
          </Button>
        </div>
      )}
    </Card>
  );

  const NeedHelpButton: ReactElement = (
    <div className="flex justify-center py-2">
      <div
        className="text-center cursor-pointer hover:opacity-80 transition-opacity"
        onClick={() => {
          setIsExpanded(true);
        }}
      >
        <div className="flex items-center justify-center gap-2 text-accent2-600 hover:text-accent2-800">
          <IconChevronDown size={24} />
          <span className="font-medium text-lg hover:underline">¿Necesitas ayuda para elegir plan?</span>
          <IconChevronDown size={24} />
        </div>
        <div className="text-sm text-gray-600 mt-1">Usa nuestra calculadora para encontrar el plan perfecto</div>
      </div>
    </div>
  );

  if (collapsible && !isExpanded) {
    return NeedHelpButton;
  }
  return Calculator();
};

export default PricingCalculator;
