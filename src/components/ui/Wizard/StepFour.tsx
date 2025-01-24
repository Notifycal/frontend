import { getUserCalendarsFromGoogle } from '@api/googleUserCalendar';
import type { FunctionComponent } from '@common/types';
import { MultiSelect } from '@mantine/core';
import { IconRefresh } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';

import { Controller, useFormContext } from 'react-hook-form';
import { z } from 'zod';
import type { Step } from './Wizard';
import type { StepTwoValues } from './StepTwo';

const StepFourSchema = z.object({
  businessCalendars: z.array(z.string()).min(1, { message: 'Debes seleccionar al menos un calendario' })
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

export const StepFour: Step<typeof StepFourSchema> = {
  component: StepFourComponent,
  schema: StepFourSchema,
  defaultValues: {
    businessCalendars: []
  }
};
