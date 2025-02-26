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
import { StepFour, type StepFourValues } from './StepFour';
import type { StepTwoValues } from './StepTwo';
import type { Step } from './Wizard';

const StepFiveSchema = z.object({
  calendars: z
    .array(calendarSchema.merge(StepFour.schema))
    .min(1, { message: i18next.t('onboarding.step5.selectMenu.error') })
});
type StepFiveValues = z.infer<typeof StepFiveSchema>;
const StepFiveComponent = (): FunctionComponent => {
  const { t } = useTranslation();
  const {
    formState: { errors },
    watch,
    control
  } = useFormContext<StepFiveValues & Pick<StepTwoValues, 'businessName'> & Pick<StepFourValues, 'templateId'>>();

  const businessName = watch('businessName');
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
            label={t('onboarding.step5.msg1', { businessName: businessName })}
            leftSection={isLoading && <IconRefresh size={14} />}
            placeholder={isLoading ? t('onboarding.step5.selectMenu.loading') : t('onboarding.step5.selectMenu.loaded')}
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

export const StepFive: Step<typeof StepFiveSchema> = {
  component: StepFiveComponent,
  schema: StepFiveSchema,
  defaultValues: {
    calendars: []
  }
};
