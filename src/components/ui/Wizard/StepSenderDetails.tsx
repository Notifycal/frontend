import { isValidMobilePhoneNumber, type LanguageCode } from '@common/i18n';
import type { FunctionComponent } from '@common/types';
import type { PhoneNumber } from '@notifycal/shared/types';
import { Controller, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import 'react-phone-number-input/style.css';
import { z } from 'zod';
import PhoneInput from '../PhoneInput/PhoneInput';
import type { Step } from './Wizard';

const StepSenderDetailsSchema = z
  .object({
    contactDetails: z.object({
      type: z.literal('phone'),
      identifier: z.object({
        country: z.string().min(2, { message: 'Phone country is required' }),
        phoneNumber: z.string().min(1, { message: 'Phone number is required' })
      })
    })
  })
  .superRefine((data, context) => {
    if (
      !isValidMobilePhoneNumber(
        data.contactDetails.identifier.phoneNumber as PhoneNumber,
        data.contactDetails.identifier.country as LanguageCode
      )
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Invalid phone number',
        path: ['contactDetails', 'identifier', 'phoneNumber']
      });
    }
  });

export type StepSenderDetailsValues = z.infer<typeof StepSenderDetailsSchema>;
const StepSenderDetailsComponent = (): FunctionComponent => {
  const { t } = useTranslation();
  const { control } = useFormContext<StepSenderDetailsValues>();

  return (
    <Controller
      control={control}
      name="contactDetails.identifier"
      render={({ field, formState }) => {
        const error =
          formState.errors.contactDetails?.identifier?.phoneNumber?.message ||
          formState.errors.contactDetails?.identifier?.country?.message;

        return (
          <PhoneInput
            error={error}
            label={t('onboarding.stepSenderDetails.msg1')}
            {...field}
            value={{
              country: field.value.country as LanguageCode,
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
    contactDetails: { identifier: { country: 'es' as LanguageCode, phoneNumber: '' as PhoneNumber }, type: 'phone' }
  }
};
