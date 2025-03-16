import { isValidMobilePhoneNumber } from '@common/i18n';
import type { FunctionComponent } from '@common/types';
import { countryCodeSchema } from '@notifycal/shared/schemas';
import type { PhoneNumber } from '@notifycal/shared/types';
import i18next from 'i18next';
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
      countryCode: countryCodeSchema,
      phoneNumber: z
        .string()
        .min(1, { message: i18next.t('onboarding.stepSenderDetails.requiredPhoneNumber') })
        .brand('PhoneNumber')
    })
  })
  .superRefine((data, context) => {
    if (!isValidMobilePhoneNumber(data.contactDetails.phoneNumber as PhoneNumber, data.contactDetails.countryCode)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: i18next.t('onboarding.stepSenderDetails.invalidPhoneNumber'),
        path: ['contactDetails', 'phoneNumber']
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
      name="contactDetails"
      render={({ field, formState }) => {
        console.log(formState);
        const error =
          formState.errors.contactDetails?.phoneNumber?.message ||
          formState.errors.contactDetails?.countryCode?.message;

        return (
          <PhoneInput
            error={error}
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
