import { Button, Card, Divider, Group, NumberInput, Select, Text, Title } from '@mantine/core';
import type { TierInfoWithIcon } from '@notifycal/shared/components';
import type { TierId } from '@notifycal/shared/types';
import { IconCalculator } from '@tabler/icons-react';
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
  const [workingDaysPerMonth, setWorkingDaysPerMonth] = useState<number>(20);
  const [calculationResult, setCalculationResult] = useState<CalculationResult | null>(null);

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
      exceedsTopTier
    };
  };

  const handleCalculate = (): void => {
    const result = calculateTierRecommendation();
    setCalculationResult(result);

    onTierRecommendation?.(result.recommendedTier?.id || null);
    onContactUsNeeded?.(result.needsContactUs);
  };

  const renderResult = (): ReactElement | null => {
    if (!calculationResult) return null;

    const { monthlyMessages, recommendedTier, needsContactUs } = calculationResult;

    if (needsContactUs) {
      return (
        <div className="text-center py-3">
          <Text className="text-gray-700 mb-2" size="sm">
            📊 {monthlyMessages}+ mensajes
          </Text>
          <Text className="text-gray-600 mb-3" size="xs">
            ¡Excelente volumen! Te invitamos a que llames, no te cortes en llamar. Si tienes este volumen de verdad, te
            hacemos algo, te buscamos una solución.
          </Text>
          <Button color="accent2" size="xs" variant="outline">
            Contactar
          </Button>
        </div>
      );
    }

    if (recommendedTier) {
      return (
        <div className="flex items-center justify-center gap-3 text-sm">
          <Text className="text-gray-600" size="sm">
            📊 {monthlyMessages} mensajes →
          </Text>
          <Button color="accent2" size="xs" variant="filled" onClick={() => onTierSelect?.(recommendedTier.id)}>
            Seleccionar {recommendedTier.displayName}
          </Button>
        </div>
      );
    }

    return (
      <Text className="text-gray-600 text-center" size="sm">
        📊 {monthlyMessages} mensajes
      </Text>
    );
  };

  return (
    <Card withBorder className="bg-white max-w-4xl mx-auto" padding="lg" radius="md" shadow="md">
      <Group gap="xs" justify="center" mb="md">
        <IconCalculator className="text-accent2-600" size={24} />
        <Title className="text-accent2-900" order={3}>
          Calculadora de Plan
        </Title>
      </Group>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
        <NumberInput
          className="w-full"
          label="Empleados"
          max={100}
          min={1}
          value={employees}
          onChange={(value) => {
            setEmployees(Number(value) || 1);
          }}
        />

        <Select
          className="w-full"
          data={timeOptions}
          label="Tiempo con cliente"
          value={avgTimeWithClient}
          onChange={(value) => {
            setAvgTimeWithClient(value || '60');
          }}
        />

        <Select
          className="w-full"
          data={workingHoursOptions}
          label="Jornada"
          value={workingHoursPerDay}
          onChange={(value) => {
            setWorkingHoursPerDay(value || '8');
          }}
        />

        <NumberInput
          className="w-full"
          label="Días laborables"
          max={31}
          min={1}
          value={workingDaysPerMonth}
          onChange={(value) => {
            setWorkingDaysPerMonth(Number(value) || 20);
          }}
        />

        <div className="flex items-end">
          <Button className="w-full" color="accent2" variant="filled" onClick={handleCalculate}>
            Calcular
          </Button>
        </div>
      </div>

      <Divider my="sm" />

      <div className="text-center mt-2">
        {renderResult() || (
          <div className="text-gray-500 py-2">
            <IconCalculator className="mx-auto mb-1 opacity-50" size={24} />
            <Text size="xs">Calcula para ver tu recomendación</Text>
          </div>
        )}
      </div>
    </Card>
  );
};

export default PricingCalculator;
