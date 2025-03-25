import type { FunctionComponent } from '@common/types';
import { TextInput } from '@mantine/core';
import type { BusinessAddress, BusinessName } from '@notifycal/shared/types';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import type { StepSenderDetailsValues } from './StepSenderDetails';
import type { Step } from './Wizard';

const StepBusinessDetailsSchema = z.object({
  business: z.object({
    name: z.string().min(1, { message: 'onboarding.stepBusinessDetails.noBusinessName' }).brand('BusinessName'),
    address: z.string().min(1, { message: 'onboarding.stepBusinessDetails.noBusinessAddress' }).brand('BusinessAddress')
  })
});
export type ErrorMessageKey =
  | 'onboarding.stepBusinessDetails.noBusinessName'
  | 'onboarding.stepBusinessDetails.noBusinessAddress';
export type StepBusinessDetailsValues = z.infer<typeof StepBusinessDetailsSchema>;
const StepBusinessDetailsComponent = (): FunctionComponent => {
  const { t } = useTranslation();
  const {
    register,
    formState: { errors }
  } = useFormContext<StepBusinessDetailsValues & StepSenderDetailsValues>();

  const errorKeyName = errors.business?.name?.message;
  const errorKeyAddress = errors.business?.address?.message;
  return (
    <>
      <TextInput
        label={t('onboarding.stepBusinessDetails.msg1')}
        labelProps={{ pb: 'sm' }}
        pb="md"
        {...register('business.name')}
        error={errorKeyName ? t(errorKeyName as ErrorMessageKey) : ''}
        type="text"
      />
      <TextInput
        label={t('onboarding.stepBusinessDetails.msg2')}
        labelProps={{ pb: 'sm' }}
        {...register('business.address')}
        error={errorKeyAddress ? t(errorKeyAddress as ErrorMessageKey) : ''}
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
