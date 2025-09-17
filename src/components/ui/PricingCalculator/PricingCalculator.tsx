import { Button, Card, Group, NumberInput, Select, Text, Title } from '@mantine/core';
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
        <div className="mt-3 p-3 bg-white border border-accent2-200 rounded text-center">
          <Text className="text-gray-700 mb-2" size="sm">
            📊 {monthlyMessages}+ mensajes → Contacto
          </Text>
          <Button fullWidth color="gray" size="sm" variant="outline">
            Contactar
          </Button>
        </div>
      );
    }

    if (recommendedTier) {
      return (
        <div className="mt-3 p-3 bg-white border border-accent2-200 rounded text-center">
          <Text className="text-gray-700 mb-2" size="sm">
            📊 {monthlyMessages} mensajes → Plan {recommendedTier.displayName}
          </Text>
          <Button
            fullWidth
            color="accent2"
            size="sm"
            variant="filled"
            onClick={() => onTierSelect?.(recommendedTier.id)}
          >
            Seleccionar {recommendedTier.displayName}
          </Button>
        </div>
      );
    }

    return (
      <div className="mt-3 p-3 bg-white border border-accent2-200 rounded text-center">
        <Text className="text-gray-700" size="sm">
          📊 {monthlyMessages} mensajes
        </Text>
      </div>
    );
  };

  return (
    <Card withBorder className="bg-white" padding="lg" radius="md" shadow="md">
      <Group gap="xs" mb="md">
        <IconCalculator className="text-accent2-600" size={24} />
        <Title className="text-accent2-900" order={3}>
          Conoce tu tarifa perfecta
        </Title>
      </Group>

      {/* <Text c="gray.6" mb="md" size="sm">
        Introduce la siguiente información y conoce tu mejor plan
      </Text> */}

      <div className="space-y-3">
        <NumberInput
          className="w-full"
          label="Número de empleados:"
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
          label="Tiempo medio con el cliente:"
          value={avgTimeWithClient}
          onChange={(value) => {
            setAvgTimeWithClient(value || '60');
          }}
        />

        <Select
          className="w-full"
          data={workingHoursOptions}
          label="Jornada del trabajador:"
          value={workingHoursPerDay}
          onChange={(value) => {
            setWorkingHoursPerDay(value || '8');
          }}
        />

        <NumberInput
          className="w-full"
          label="Días laborables por mes:"
          max={31}
          min={1}
          value={workingDaysPerMonth}
          onChange={(value) => {
            setWorkingDaysPerMonth(Number(value) || 20);
          }}
        />

        <Button fullWidth className="mt-3" color="accent2" variant="filled" onClick={handleCalculate}>
          Calcular estimación
        </Button>

        {renderResult()}
      </div>

      <div className="mt-4">
        <Title className="text-gray-700 mb-1" order={5}>
          Habla con nosotros
        </Title>
        <Text c="gray.6" mb="2" size="xs">
          Si buscas una solución más avanzada o personalizada
        </Text>
        <Button fullWidth color="gray" size="xs" variant="outline">
          Contactar
        </Button>
      </div>
    </Card>
  );
};

export default PricingCalculator;
