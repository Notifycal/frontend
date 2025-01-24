import type { FunctionComponent } from '@common/types';
import { TextInput } from '@mantine/core';

import { useFormContext } from 'react-hook-form';
import { z } from 'zod';
import type { Step } from './Wizard';
import type { StepTwoValues } from './StepTwo';

const StepThreeSchema = z.object({
  businessAddress: z.string().min(1, { message: 'La direccion del negocio es obligatorio. ' })
});
type StepThreeValues = z.infer<typeof StepThreeSchema>;
const StepThreeComponent = (): FunctionComponent => {
  const {
    register,
    formState: { errors },
    watch
  } = useFormContext<StepThreeValues & Pick<StepTwoValues, 'businessName'>>();

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
export const StepThree: Step<typeof StepThreeSchema> = {
  component: StepThreeComponent,
  schema: StepThreeSchema,
  defaultValues: {
    businessAddress: ''
  }
};
