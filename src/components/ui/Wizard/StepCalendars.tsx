import { getUserCalendarsFromGoogle } from '@api/googleUserCalendar';
import type { FunctionComponent } from '@common/types';
import { MultiSelect } from '@mantine/core';
import { calendarSchema } from '@notifycal/shared/schemas';
import { IconRefresh } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';

import i18next from 'i18next';
import { Controller, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import type { StepBusinessDetailsValues } from './StepBusinessDetails';
import { StepReminderType, type StepReminderTypeValues } from './StepReminderType';
import type { Step } from './Wizard';

const StepCalendarsSchema = z.object({
  calendars: z
    .array(calendarSchema.merge(StepReminderType.schema))
    .min(1, { message: i18next.t('onboarding.stepCalendars.selectMenu.error') })
});
type StepCalendarsValues = z.infer<typeof StepCalendarsSchema>;
const StepCalendarsComponent = (): FunctionComponent => {
  const { t } = useTranslation();
  const {
    formState: { errors },
    watch,
    control
  } = useFormContext<
    StepCalendarsValues & Pick<StepReminderTypeValues, 'templateId'> & Pick<StepBusinessDetailsValues, 'business'>
  >();

  const businessName = watch('business').name;
  const templateId = watch('templateId');

  const { data: Calendars, isLoading } = useQuery({
    queryKey: ['userIdPCalendars'],
    queryFn: getUserCalendarsFromGoogle
  });

  return (
    <>
      <Controller
        control={control}
        name="calendars"
        render={({ field: { onChange } }) => (
          <MultiSelect
            comboboxProps={{ shadow: 'md' }}
            data={(Calendars || []).map((c) => ({ label: c.name, value: c.id }))}
            disabled={isLoading}
            error={errors['calendars']?.message}
            label={t('onboarding.stepCalendars.msg1', { businessName: businessName })}
            leftSection={isLoading && <IconRefresh size={14} />}
            placeholder={
              isLoading
                ? t('onboarding.stepCalendars.selectMenu.loading')
                : t('onboarding.stepCalendars.selectMenu.loaded')
            }
            onChange={(v) => {
              onChange(
                (Calendars || []).filter((c) => v.includes(c.id)).map((c) => ({ ...c, templateId: templateId }))
              );
            }}
          />
        )}
      />
    </>
  );
};

export const StepCalendars: Step<typeof StepCalendarsSchema> = {
  component: StepCalendarsComponent,
  schema: StepCalendarsSchema,
  defaultValues: {
    calendars: []
  }
};
