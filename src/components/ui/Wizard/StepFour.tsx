import { getUserCalendarsFromGoogle } from '@api/googleUserCalendar';
import type { FunctionComponent } from '@common/types';
import { MultiSelect } from '@mantine/core';
import { IconRefresh } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';

import { Controller, useFormContext } from 'react-hook-form';
import { z } from 'zod';
import type { Step } from './Wizard';

const StepFourComponent = (): FunctionComponent => {
  const {
    formState: { errors },
    watch,
    control
  } = useFormContext<{
    businessCalendars: Array<string>;
    businessName: string; // Required only for display purposes
  }>();

  const businessName = watch('businessName');

  const { data: Calendars, isLoading } = useQuery({
    queryKey: ['userIdPCalendars'],
    queryFn: getUserCalendarsFromGoogle
  });

  return (
    <>
      <Controller
        control={control}
        name="businessCalendars"
        render={({ field }) => (
          <MultiSelect
            {...field} // Pass value and onChange from react-hook-form
            comboboxProps={{ shadow: 'md' }}
            data={Calendars?.Calendars}
            disabled={isLoading}
            error={errors['businessCalendars']?.message || undefined}
            label={`Selecciona los calendarios que quieres usar para ${businessName}`}
            leftSection={isLoading && <IconRefresh size={14} />}
            placeholder={isLoading ? 'Buscando calendarios del usuario...' : 'Selecciona uno o más calendarios'}
          />
        )}
      />
    </>
  );
};

const StepFourSchema = z.object({
  businessCalendars: z.array(z.string()).min(1, { message: 'Debes seleccionar al menos un calendario' })
});

const defaultValues: z.infer<typeof StepFourSchema> = {
  businessCalendars: []
};

export const StepFour: Step<z.infer<typeof StepFourSchema>> = {
  component: StepFourComponent,
  schema: StepFourSchema,
  defaultValues,
};
