import type { FunctionComponent } from '@common/types';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import type { Step } from './Wizard';

const StepFinalComponent = (): FunctionComponent => {
  const { t } = useTranslation();
  return (
    <>
      <p className="text-sm md:text-base text-gray-600 mb-6">{t('onboarding.stepFinal.msg1')}</p>
    </>
  );
};

const StepFinalSchema = z.object({});
export const StepFinal: Step<typeof StepFinalSchema> = {
  component: StepFinalComponent,
  schema: StepFinalSchema,
  defaultValues: {}
};
