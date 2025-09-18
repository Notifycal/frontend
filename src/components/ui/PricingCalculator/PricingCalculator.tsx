import { Button, Card, Group, NumberInput, Select, Text } from '@mantine/core';
import type { TierInfoWithIcon } from '@notifycal/shared/components';
import type { TierId } from '@notifycal/shared/types';
import { IconArrowRight, IconCalculator, IconChartBar, IconClock } from '@tabler/icons-react';
import { useState, type FC, type ReactElement } from 'react';

interface PricingCalculatorProps {
  orderedTierInfoWithIcons: Array<TierInfoWithIcon>;
  onTierRecommendation?: (recommendedTierId: string | null) => void;
  onContactUsNeeded?: (shouldShow: boolean) => void;
  onTierSelect?: (tierId: TierId) => void;
}

interface CalculationResult {
  monthlyMessages: number;
  recommendedTier: TierInfoWithIcon | null;
  needsContactUs: boolean;
  exceedsTopTier: boolean;
  savedHours: number;
}

const PricingCalculator: FC<PricingCalculatorProps> = ({
  orderedTierInfoWithIcons,
  onTierRecommendation,
  onContactUsNeeded,
  onTierSelect
}) => {
  const [employees, setEmployees] = useState<number>(1);
  const [avgTimeWithClient, setAvgTimeWithClient] = useState<string>('60');
  const [workingHoursPerDay, setWorkingHoursPerDay] = useState<string>('8');
  const [workingDaysPerMonth, setWorkingDaysPerMonth] = useState<number>(22);
  const [calculationResult, setCalculationResult] = useState<CalculationResult | null>(null);

  // Calculation constants
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

    // Calculate saved hours (assuming X minutes per manual message)
    const totalMinutesSaved = monthlyMessages * minutesPerMessage;
    const savedHours = Math.round((totalMinutesSaved / 60) * 10) / 10; // Round to 1 decimal

    let recommendedTier: TierInfoWithIcon | null = null;
    let needsContactUs = false;
    let exceedsTopTier = false;

    const sortedTiers = [...orderedTierInfoWithIcons].sort((a, b) => a.numberOfReminders - b.numberOfReminders);
    const topTier = sortedTiers[sortedTiers.length - 1];
    const maxTierLimit = topTier?.numberOfReminders || 0;

    if (monthlyMessages > maxTierLimit * 1.5) {
      needsContactUs = true;
    } else if (monthlyMessages > maxTierLimit) {
      exceedsTopTier = true;
      recommendedTier = topTier ?? null;
    } else {
      recommendedTier = sortedTiers.find((tier) => monthlyMessages <= tier.numberOfReminders) ?? null;
    }

    return {
      monthlyMessages,
      recommendedTier,
      needsContactUs,
      exceedsTopTier,
      savedHours
    };
  };

  const handleCalculate = (): void => {
    const result = calculateTierRecommendation();
    setCalculationResult(result);

    onTierRecommendation?.(result.recommendedTier?.id || null);
    onContactUsNeeded?.(result.needsContactUs);
  };

  const renderSecondaryMetrics = (monthlyMessages: number, savedHours: number): ReactElement => (
    <div className="space-y-1">
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

  const renderMetrics = (monthlyMessages: number, savedHours: number, isContactUs = false): ReactElement => (
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
      {renderSecondaryMetrics(monthlyMessages, savedHours)}
    </div>
  );

  const renderRecommendationSection = (): ReactElement => (
    <div className="col-span-1 text-center flex flex-col items-center justify-center h-full">
      <IconArrowRight className="text-accent2-300" size={58} />
    </div>
  );

  const renderActionButton = (type: 'contact' | 'tier', tier?: TierInfoWithIcon): ReactElement => (
    <div className="mx-auto text-center md:col-span-5">
      {type === 'contact' ? (
        <>
          <Button className="w-full md:w-auto text-xl py-4 font-bold" color="accent2" size="xl" variant="filled">
            Contactar
          </Button>
          <Text className="text-gray-500 mt-1" size="xs">
            Solución personalizada
          </Text>
        </>
      ) : (
        <Button
          className="w-full md:w-auto md:min-w-62 text-sm md:text-xl py-4 font-bold"
          color="primary"
          size="xl"
          variant="filled"
          onClick={() => tier && onTierSelect?.(tier.id)}
        >
          <span className="md:hidden">Plan {tier?.displayName}</span>
          <span className="hidden md:inline">Seleccionar Plan {tier?.displayName}</span>
        </Button>
      )}
    </div>
  );

  const renderResult = (): ReactElement | null => {
    if (!calculationResult) return null;

    const { monthlyMessages, recommendedTier, needsContactUs, savedHours } = calculationResult;
    const showRecommendation = needsContactUs || recommendedTier;

    if (showRecommendation) {
      return (
        <div className="w-full">
          {/* Desktop: horizontal layout */}
          <div className="hidden md:grid md:grid-cols-12 items-center">
            {renderMetrics(monthlyMessages, savedHours, needsContactUs)}
            {renderRecommendationSection()}
            {renderActionButton(needsContactUs ? 'contact' : 'tier', recommendedTier ?? undefined)}
          </div>

          {/* Mobile: vertical layout */}
          <div className="md:hidden space-y-4">
            {renderMetrics(monthlyMessages, savedHours, needsContactUs)}
            <div className="text-center">
              <IconArrowRight className="text-accent2-300 mx-auto rotate-90" size={32} />
            </div>
            {renderActionButton(needsContactUs ? 'contact' : 'tier', recommendedTier ?? undefined)}
          </div>
        </div>
      );
    }

    return (
      <div className="w-full flex items-center justify-center">
        {renderMetrics(monthlyMessages, savedHours, needsContactUs)}
      </div>
    );
  };

  return (
    <Card withBorder className="bg-white max-w-4xl mx-auto" padding="lg" radius="md" shadow="md">
      <Group gap="xs" justify="center" mb="md">
        <IconCalculator className="text-accent2-600 mb-2" size={30} />
        <h4 className="font-semibold">Calculadora de plan</h4>
      </Group>

      {/* RESULTS SECTION - NOW AT TOP */}
      <div className="mb-4 p-4 md:px-10 border border-gray-400 rounded-lg min-h-[200px] flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 shadow-inner">
        {renderResult() || (
          <div className="text-gray-500 py-2 text-center">
            <IconCalculator className="mx-auto mb-1 opacity-50" size={24} />
            <Text size="xs">Calcula para ver tu recomendación</Text>
          </div>
        )}
      </div>
      {/* INPUTS + CALCULATE BUTTON - RESPONSIVE LAYOUT */}
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
    </Card>
  );
};

export default PricingCalculator;
