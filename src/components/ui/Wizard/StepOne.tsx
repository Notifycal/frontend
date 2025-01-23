import type { FunctionComponent } from '@common/types';
import { z } from 'zod';
import type { Step } from './Wizard';

const StepOneComponent = (): FunctionComponent => {
  return (
    <>
      <p className="text-sm md:text-base text-gray-600 mb-6">
        Antes de continuar, necesitamos conocer un poco más sobre ti y tu negocio.
      </p>
      <p className="text-sm md:text-base text-gray-600 mb-6">
        Estos datos son necesarios para poder mandarle recordatorios a tus clientes.
      </p>
    </>
  );
};

const StepOneSchema = z.object({})
export const StepOne: Step<typeof StepOneSchema> = {
  component: StepOneComponent,
  schema: StepOneSchema,
  defaultValues: {}
};
