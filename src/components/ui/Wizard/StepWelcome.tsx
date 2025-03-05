import type { FunctionComponent } from '@common/types';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import type { Step } from './Wizard';

const StepWelcomeComponent = (): FunctionComponent => {
  const { t } = useTranslation();
  return (
    <>
      <p className="text-sm md:text-base text-gray-600 mb-6">{t('onboarding.stepWelcome.msg1')}</p>
      <p className="text-sm md:text-base text-gray-600 mb-6">{t('onboarding.stepWelcome.msg2')}</p>
    </>
  );
};

const StepWelcomeSchema = z.object({});
export const StepWelcome: Step<typeof StepWelcomeSchema> = {
  component: StepWelcomeComponent,
  schema: StepWelcomeSchema,
  defaultValues: {}
};
