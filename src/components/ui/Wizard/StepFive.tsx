import type { FunctionComponent } from '@common/types';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import type { Step } from './Wizard';

const StepFiveComponent = (): FunctionComponent => {
  const { t } = useTranslation();
  return (
    <>
      <p className="text-sm md:text-base text-gray-600 mb-6">{t('onboarding.step5.msg1')}</p>
    </>
  );
};

const StepFiveSchema = z.object({});
export const StepFive: Step<typeof StepFiveSchema> = {
  component: StepFiveComponent,
  schema: StepFiveSchema,
  defaultValues: {}
};
