import type { TierInfoWithIcon } from '@notifycal/shared/components';

export interface CalculationResult {
  monthlyMessages: number;
  recommendedTier: TierInfoWithIcon;
  exceedsTopTier: boolean;
  savedHours: number;
}

export const timeOptions = [
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

export const workingHoursOptions = [
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

interface CalculationParameters {
  employees: number;
  avgTimeWithClient: string;
  workingHoursPerDay: string;
  workingDaysPerMonth: number;
  minutesPerMessage: number;
  orderedTierInfoWithIcons: Array<TierInfoWithIcon>;
}

export const calculateTierRecommendation = (parameters: CalculationParameters): CalculationResult => {
  const {
    employees,
    avgTimeWithClient,
    workingHoursPerDay,
    workingDaysPerMonth,
    minutesPerMessage,
    orderedTierInfoWithIcons
  } = parameters;

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
