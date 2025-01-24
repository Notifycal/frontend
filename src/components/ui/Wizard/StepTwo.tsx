import type { FunctionComponent } from '@common/types';
import { TextInput } from '@mantine/core';
import { useFormContext } from 'react-hook-form';
import { z } from 'zod';
import type { Step } from './Wizard';

const StepTwoSchema = z.object({
  businessName: z.string().min(1, { message: 'El nombre del negocio es obligatorio. ' })
})
export type StepTwoValues = z.infer<typeof StepTwoSchema>;
const StepTwoComponent = (): FunctionComponent => {
  const {
    register,
    formState: { errors }
  } = useFormContext<StepTwoValues>();

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


export const StepTwo: Step<typeof StepTwoSchema> = {
  component: StepTwoComponent,
  schema: StepTwoSchema,
  defaultValues: {
    businessName: ''
  }
};
