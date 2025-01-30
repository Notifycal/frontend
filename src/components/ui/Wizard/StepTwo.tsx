import type { FunctionComponent } from '@common/types';
import { TextInput } from '@mantine/core';
import type { BusinessName } from '@notifycal/shared/types';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import type { Step } from './Wizard';

const StepTwoSchema = z.object({
  businessName: z.string().min(1, { message: 'El nombre del negocio es obligatorio. ' }).brand('BusinessName')
});
export type StepTwoValues = z.infer<typeof StepTwoSchema>;
const StepTwoComponent = (): FunctionComponent => {
  const { t } = useTranslation();
  const {
    register,
    formState: { errors }
  } = useFormContext<StepTwoValues>();

  return (
    <>
      <TextInput
        label={t('onboarding.step2.msg1')}
        {...register('businessName')}
        error={errors['businessName']?.message}
        type="text"
      />
    </>
  );
};

export const StepTwo: Step<typeof StepTwoSchema> = {
  component: StepTwoComponent,
  schema: StepTwoSchema,
  defaultValues: {
    businessName: '' as BusinessName
  }
};
