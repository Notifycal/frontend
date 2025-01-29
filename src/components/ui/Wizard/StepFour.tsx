import { getUserCalendarsFromGoogle } from '@api/googleUserCalendar';
import type { FunctionComponent } from '@common/types';
import { MultiSelect } from '@mantine/core';
import { IconRefresh } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';

import { Controller, useFormContext } from 'react-hook-form';
import { z } from 'zod';
import type { StepTwoValues } from './StepTwo';
import type { Step } from './Wizard';

export const calendarSchema = z.object({
  id: z.string(),
  name: z.string()
});
const StepFourSchema = z.object({
  calendars: z.array(calendarSchema).min(1, { message: 'Debes seleccionar al menos un calendario' })
});
type StepFourValues = z.infer<typeof StepFourSchema>;
const StepFourComponent = (): FunctionComponent => {
  const {
    formState: { errors },
    watch,
    control
  } = useFormContext<StepFourValues & Pick<StepTwoValues, 'businessName'>>();

  const businessName = watch('businessName');

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
            error={errors['calendars']?.message || undefined}
            label={`Selecciona los calendarios que quieres usar para ${businessName}`}
            leftSection={isLoading && <IconRefresh size={14} />}
            placeholder={isLoading ? 'Buscando calendarios del usuario...' : 'Selecciona uno o más calendarios'}
            onChange={(v) => {
              onChange((Calendars || []).filter((c) => v.includes(c.id)));
            }}
          />
        )}
      />
    </>
  );
};

export const StepFour: Step<typeof StepFourSchema> = {
  component: StepFourComponent,
  schema: StepFourSchema,
  defaultValues: {
    calendars: []
  }
};
