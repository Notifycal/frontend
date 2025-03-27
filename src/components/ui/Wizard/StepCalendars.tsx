import { getUserCalendarsFromGoogle } from '@api/googleUserCalendar';
import type { FunctionComponent } from '@common/types';
import { MultiSelect } from '@mantine/core';
import { calendarSchema } from '@notifycal/shared/schemas';
import { IconRefresh } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';

import { Controller, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import type { StepBusinessDetailsValues } from './StepBusinessDetails';
import { StepReminderType, type StepReminderTypeValues } from './StepReminderType';
import type { Step } from './Wizard';

const StepCalendarsSchema = z.object({
  calendars: z
    .array(calendarSchema.extend({ template: StepReminderType.schema }))
    .min(1, { message: 'onboarding.stepCalendars.selectMenu.error' })
});
type StepCalendarsValues = z.infer<typeof StepCalendarsSchema>;
const StepCalendarsComponent = (): FunctionComponent => {
  const { t } = useTranslation();
  const {
    formState: { errors },
    watch,
    control
  } = useFormContext<StepCalendarsValues & StepReminderTypeValues & Pick<StepBusinessDetailsValues, 'business'>>();

  const businessName = watch('business').name;
  const templateId = watch('id');
  const templateLanguage = watch('language');

  const { data: Calendars, isLoading } = useQuery({
    queryKey: ['userIdPCalendars'],
    queryFn: getUserCalendarsFromGoogle
  });
  const errorKey = errors.calendars?.message;
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
            error={errorKey ? t(errorKey as 'onboarding.stepCalendars.selectMenu.error') : ''}
            label={t('onboarding.stepCalendars.msg1', { businessName: businessName })}
            labelProps={{ pb: 'sm' }}
            leftSection={isLoading && <IconRefresh size={14} />}
            placeholder={
              isLoading
                ? t('onboarding.stepCalendars.selectMenu.loading')
                : t('onboarding.stepCalendars.selectMenu.loaded')
            }
            onChange={(v) => {
              onChange(
                (Calendars || [])
                  .filter((c) => v.includes(c.id))
                  .map((c) => ({ ...c, template: { id: templateId, language: templateLanguage } }))
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
