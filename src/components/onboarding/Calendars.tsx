import { getUserCalendarsFromGoogle } from '@api/googleUserCalendar';
import type { NotifycalTFunction } from '@common/i18n';
import { calendarSchema } from '@notifycal/shared/schemas';
import { z } from 'zod';

import { useI18nForm } from '@hooks/useI18nForm';
import { useStepSubmit } from '@hooks/useOnboardingStepSubmit';
import { useOnboardingStore } from '@store/useOnboardingStore';
import { useQuery } from '@tanstack/react-query';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useFormFieldCommonProps } from '@hooks/useFormFieldCommonProps';

import OnboardingNavigation from '@components/layout/onboarding/OnboardingNavigation';
import { MultiSelect } from '@mantine/core';
import { IconRefresh } from '@tabler/icons-react';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const calendarsSchema = (t: NotifycalTFunction) =>
  z.object({
    calendars: z.array(calendarSchema).min(1, { message: t('calendars.selectMenu.error') })
  });

type CalendarsInput = z.input<ReturnType<typeof calendarsSchema>>;
type CalendarsOutput = z.output<ReturnType<typeof calendarsSchema>>;
export type CalendarsValues = CalendarsOutput;

type Calendar = z.infer<typeof calendarSchema>;

const emptyInitialValue = {
  calendars: []
};

const Calendars: React.FC = () => {
  const { data } = useOnboardingStore();
  const { handleStepSubmit } = useStepSubmit();
  const { t } = useTranslation('onboarding');

  const methods = useI18nForm<CalendarsInput, unknown, CalendarsOutput>(
    calendarsSchema,
    {
      mode: 'onChange',
      defaultValues: data.calendars || emptyInitialValue
    },
    t
  );

  const {
    control,
    handleSubmit,
    formState: { isValid }
  } = methods;

  const { commonFormFieldProps } = useFormFieldCommonProps(methods);

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
              leftSection={isLoading && <IconRefresh size={14} />}
              value={isLoading ? [] : value.map((v) => v.id)}
              onChange={(value) => {
                if (!isLoading) {
                  onChange(calendarValuesToFullCalendars(value));
                }
              }}
              {...commonFormFieldProps('calendars', {
                label: t('calendars.formCalendarsField.label', { businessName }),
                placeholder: t(placeholderTextKey),
                resetValue: []
              })}
            />
          )}
        />

        <div className="text-sm text-gray-500 mt-4">{t('calendars.explanation')}</div>
      </div>

      <OnboardingNavigation canProceed={isValid} onProceed={handleSubmit(handleStepSubmit)} />
    </form>
  );
};

export default Calendars;
