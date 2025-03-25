import { isValidMobilePhoneNumber } from '@common/i18n';
import type { FunctionComponent } from '@common/types';
import { countryCodeSchema } from '@notifycal/shared/schemas';
import type { PhoneNumber } from '@notifycal/shared/types';
import { Controller, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import PhoneInput from '../PhoneInput/PhoneInput';
import type { Step } from './Wizard';

const StepSenderDetailsSchema = z
  .object({
    contactDetails: z.object({
      type: z.literal('phone'),
      countryCode: countryCodeSchema,
      phoneNumber: z
        .string()
        .min(1, { message: 'onboarding.stepSenderDetails.requiredPhoneNumber' })
        .brand('PhoneNumber')
    })
  })
  .superRefine((data, context) => {
    if (!isValidMobilePhoneNumber(data.contactDetails.phoneNumber as PhoneNumber, data.contactDetails.countryCode)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'onboarding.stepSenderDetails.invalidPhoneNumber',
        path: ['contactDetails', 'phoneNumber']
      });
    }
  });

export type ErrorMessageKey =
  | 'onboarding.stepSenderDetails.requiredPhoneNumber'
  | 'onboarding.stepSenderDetails.invalidPhoneNumber';
export type StepSenderDetailsValues = z.infer<typeof StepSenderDetailsSchema>;
const StepSenderDetailsComponent = (): FunctionComponent => {
  const { t } = useTranslation();
  const { control } = useFormContext<StepSenderDetailsValues>();

  return (
    <Controller
      control={control}
      name="contactDetails"
      render={({ field, formState }) => {
        const errorKey =
          formState.errors.contactDetails?.phoneNumber?.message ||
          formState.errors.contactDetails?.countryCode?.message;

        return (
          <PhoneInput
            error={errorKey ? t(errorKey as 'onboarding.stepSenderDetails.invalidPhoneNumber') : ''}
            label={t('onboarding.stepSenderDetails.msg1')}
            {...field}
            value={{
              type: 'phone',
              countryCode: field.value.countryCode,
              phoneNumber: field.value.phoneNumber as PhoneNumber
            }}
          />
        );
      }}
    />
  );
};

export const StepSenderDetails: Step<typeof StepSenderDetailsSchema> = {
  component: StepSenderDetailsComponent,
  schema: StepSenderDetailsSchema,
  defaultValues: {
    contactDetails: { type: 'phone', countryCode: 'ES', phoneNumber: '' as PhoneNumber }
  }
};
