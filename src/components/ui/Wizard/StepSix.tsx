import type { FunctionComponent } from '@common/types';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import type { Step } from './Wizard';

const StepSixComponent = (): FunctionComponent => {
  const { t } = useTranslation();
  return (
    <>
      <p className="text-sm md:text-base text-gray-600 mb-6">{t('onboarding.step6.msg1')}</p>
    </>
  );
};

const StepSixSchema = z.object({});
export const StepSix: Step<typeof StepSixSchema> = {
  component: StepSixComponent,
  schema: StepSixSchema,
  defaultValues: {}
};
