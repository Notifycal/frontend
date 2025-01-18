import type { FunctionComponent } from '@common/types';
import { z } from 'zod';
import type { Step } from './Wizard';

const StepFiveComponent = (): FunctionComponent => {
  return (
    <>
      <p className="text-sm md:text-base text-gray-600 mb-6">
        Ya puedes continuar! Haz click en Finalizar para acceder a Notifycal.
      </p>
    </>
  );
};

export const StepFive: Step<Record<string, never>> = {
  component: StepFiveComponent,
  schema: z.object({}),
  defaultValues: {}
};
