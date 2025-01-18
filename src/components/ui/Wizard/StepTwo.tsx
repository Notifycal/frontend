import type { FunctionComponent } from '@common/types';
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
      <p className="text-sm md:text-base text-gray-600 mb-6">¿Cómo se llama tu negocio?</p>
      <input
        className="border rounded-md p-2 w-full"
        placeholder="Nombre del negocio"
        type="text"
        {...register('businessName')}
      />
      {errors.businessName && <p className="text-red-500 text-sm">{errors.businessName.message}</p>}
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
