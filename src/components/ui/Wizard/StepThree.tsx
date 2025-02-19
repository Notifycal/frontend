import type { FunctionComponent } from '@common/types';
import { TextInput } from '@mantine/core';

import type { BusinessAddress } from '@notifycal/shared/types';
import i18next from 'i18next';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import type { StepTwoValues } from './StepTwo';
import type { Step } from './Wizard';

const StepThreeSchema = z.object({
  businessAddress: z
    .string()
    .min(1, { message: i18next.t('onboarding.step3.noBusinessAddress') })
    .brand('BusinessAddress')
});
type StepThreeValues = z.infer<typeof StepThreeSchema>;
const StepThreeComponent = (): FunctionComponent => {
  const { t } = useTranslation();
  const {
    register,
    formState: { errors },
    watch
  } = useFormContext<StepThreeValues & Pick<StepTwoValues, 'businessName'>>();

  const businessName = watch('businessName');

  return (
    <>
      <TextInput
        label={t('onboarding.step3.msg1', { businessName: businessName })}
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
    businessAddress: '' as BusinessAddress
  }
};
