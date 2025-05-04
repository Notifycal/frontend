import { getUserCalendarsFromGoogle } from '@api/googleUserCalendar';
import type { NotifycalI18nNamespaces } from '@common/i18n';
import { zodResolver } from '@hookform/resolvers/zod';
import { calendarSchema } from '@notifycal/shared/schemas';
import type { TFunction } from 'i18next';
import { z } from 'zod';

import { useStepSubmit } from '@hooks/useOnboardingStepSubmit';
import { useOnboardingStore } from '@store/useOnboardingStore';
import { useQuery } from '@tanstack/react-query';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import OnboardingNavigation from '@components/layout/onboarding/OnboardingNavigation';
import { MultiSelect } from '@mantine/core';
import { IconRefresh } from '@tabler/icons-react';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const calendarsSchema = (t: TFunction<NotifycalI18nNamespaces, undefined>) =>
  z.object({
    calendars: z.array(calendarSchema).min(1, { message: t('calendars.selectMenu.error') })
  });

export type CalendarsValues = z.infer<ReturnType<typeof calendarsSchema>>;

type Calendar = z.infer<typeof calendarSchema>;

const Calendars: React.FC = () => {
  const { data } = useOnboardingStore();
  const { handleStepSubmit } = useStepSubmit();
  const { t } = useTranslation('onboarding');

  const {
    control,
    handleSubmit,
    formState: { errors, isValid }
  } = useForm<CalendarsValues>({
    resolver: zodResolver(calendarsSchema(t)),
    mode: 'onChange',
    defaultValues: {
      calendars: data.calendars?.calendars || []
    }
  });

  const { data: userCalendars, isLoading } = useQuery({
    queryKey: ['userIdPCalendars'],
    queryFn: getUserCalendarsFromGoogle
  });

  const businessName = data.businessDetails?.name;

  const calendarData = (userCalendars || []).map((c) => ({ label: c.name, value: c.id }));

  const placeholderTextKey = isLoading
    ? 'calendars.formCalendarsField.placeholderLoading'
    : 'calendars.formCalendarsField.placeholderLoaded';

  const calendarValuesToFullCalendars = (newValue: Array<string>): Array<Calendar> => {
    return (userCalendars || []).filter(({ id }) => newValue.includes(id));
  };

  return (
    <form onSubmit={handleSubmit(handleStepSubmit)}>
      <div className="space-y-6">
        <Controller
          control={control}
          name="calendars"
          render={({ field: { value, onChange } }) => (
            <MultiSelect
              comboboxProps={{ shadow: 'md' }}
              data={calendarData}
              disabled={isLoading}
              error={errors.calendars && errors.calendars.message}
              label={t('calendars.formCalendarsField.label', { businessName })}
              labelProps={{ pb: 'sm' }}
              leftSection={isLoading && <IconRefresh size={14} />}
              placeholder={t(placeholderTextKey)}
              value={isLoading ? [] : value.map((v) => v.id)}
              onChange={(value) => {
                if (!isLoading) {
                  onChange(calendarValuesToFullCalendars(value));
                }
              }}
            />
          )}
        />

        <div className="text-sm text-gray-500 mt-4">{t('calendars.explanation')}</div>
      </div>

      <OnboardingNavigation canProceed={isValid} isLastStep={false} onProceed={handleSubmit(handleStepSubmit)} />
    </form>
  );
};

export default Calendars;
