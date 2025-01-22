import type { FunctionComponent } from '@common/types';
import { TextInput } from '@mantine/core';
import { useFormContext } from 'react-hook-form';
import { z } from 'zod';
import type { Step } from './Wizard';

const StepTwoComponent = (): FunctionComponent => {
  const {
    register,
    formState: { errors }
  } = useFormContext<{ businessName: string }>();

  return (
    <>
      <TextInput
        label="¿Cómo se llama tu negocio?"
        {...register('businessName')}
        error={errors['businessName']?.message}
        type="text"
      />
    </>
  );
};

export const StepTwo: Step<{ businessName: string }> = {
  component: StepTwoComponent,
  schema: z.object({
    businessName: z.string().min(1, { message: 'El nombre del negocio es obligatorio. ' })
  }),
  defaultValues: {
    businessName: ''
  }
};
