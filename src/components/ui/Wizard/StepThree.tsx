import type { FunctionComponent } from '@common/types';
import { TextInput } from '@mantine/core';

import { useFormContext } from 'react-hook-form';
import { z } from 'zod';
import type { Step } from './Wizard';

const StepThreeComponent = (): FunctionComponent => {
  const {
    register,
    formState: { errors },
    watch
  } = useFormContext<{ businessAddress: string; businessName: string }>();

  const businessName = watch('businessName');

  return (
    <>
      <TextInput
        label={`Cual es la direccion de ${businessName}?`}
        {...register('businessAddress')}
        error={errors['businessAddress']?.message}
      />
    </>
  );
};

export const StepThree: Step<{ businessAddress: string }> = {
  component: StepThreeComponent,
  schema: z.object({
    businessAddress: z.string().min(1, { message: 'La direccion del negocio es obligatorio. ' })
  }),
  defaultValues: {
    businessAddress: ''
  }
};
