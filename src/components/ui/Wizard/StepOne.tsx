import type { FunctionComponent } from '@common/types';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import type { Step } from './Wizard';

const StepOneComponent = (): FunctionComponent => {
  const { t } = useTranslation();
  return (
    <>
      <p className="text-sm md:text-base text-gray-600 mb-6">
      {t('onboarding.step1.msg1')}
      </p>
      <p className="text-sm md:text-base text-gray-600 mb-6">
      {t('onboarding.step1.msg2')}
      </p>
    </>
  );
};

const StepOneSchema = z.object({});
export const StepOne: Step<typeof StepOneSchema> = {
  component: StepOneComponent,
  schema: StepOneSchema,
  defaultValues: {}
};
