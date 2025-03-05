import type { FunctionComponent } from '@common/types';
import { TextInput } from '@mantine/core';
import type { BusinessAddress, BusinessName } from '@notifycal/shared/types';
import i18next from 'i18next';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import type { StepSenderDetailsValues } from './StepSenderDetails';
import type { Step } from './Wizard';

const StepBusinessDetailsSchema = z.object({
  business: z.object({
    name: z
      .string()
      .min(1, { message: i18next.t('onboarding.stepBusinessDetails.noBusinessName') })
      .brand('BusinessName'),
    address: z
      .string()
      .min(1, { message: i18next.t('onboarding.stepBusinessDetails.noBusinessAddress') })
      .brand('BusinessAddress')
  })
});
export type StepBusinessDetailsValues = z.infer<typeof StepBusinessDetailsSchema>;
const StepBusinessDetailsComponent = (): FunctionComponent => {
  const { t } = useTranslation();
  const {
    register,
    watch,
    formState: { errors }
  } = useFormContext<StepBusinessDetailsValues & StepSenderDetailsValues>();

  //TODO: remove
  const xxx = watch('contactDetails');

  console.info(xxx);
  return (
    <>
      <TextInput
        label={t('onboarding.stepBusinessDetails.msg1')}
        {...register('business.name')}
        error={errors.business?.name?.message}
        type="text"
      />
      <TextInput
        label={t('onboarding.stepBusinessDetails.msg2')}
        {...register('business.address')}
        error={errors.business?.address?.message}
      />
    </>
  );
};

export const StepBusinessDetails: Step<typeof StepBusinessDetailsSchema> = {
  component: StepBusinessDetailsComponent,
  schema: StepBusinessDetailsSchema,
  defaultValues: {
    business: {
      name: '' as BusinessName,
      address: '' as BusinessAddress
    }
  }
};
