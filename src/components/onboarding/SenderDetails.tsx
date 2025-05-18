import { type NotifycalTFunction, isValidMobilePhoneNumber } from '@common/i18n';
import { countryCodeSchema } from '@notifycal/shared/schemas';
import type { PhoneNumber } from '@notifycal/shared/types';
import { z } from 'zod';

import { useFormFieldCommonProps } from '@hooks/useFormFieldCommonProps';
import { useI18nForm } from '@hooks/useI18nForm';
import { useStepSubmit } from '@hooks/useOnboardingStepSubmit';
import { useOnboardingStore } from '@store/useOnboardingStore';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import OnboardingNavigation from '@components/layout/onboarding/OnboardingNavigation';
import PhoneInput from '../ui/PhoneInput/PhoneInput';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const senderDetailsSchema = (t: NotifycalTFunction) =>
  z
    .object({
      contactDetails: z.object({
        type: z.literal('phone'),
        countryCode: countryCodeSchema,
        phoneNumber: z
          .string()
          .min(1, { message: t('senderDetails.formSenderNumber.isRequired') })
          .transform((value) => value as PhoneNumber)
      })
    })
    .superRefine((values, context) => {
      if (
        !isValidMobilePhoneNumber(values.contactDetails.phoneNumber as PhoneNumber, values.contactDetails.countryCode)
      ) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: t('senderDetails.formSenderNumber.isInvalid'),
          path: ['contactDetails', 'phoneNumber']
        });
      }
    });

type SenderDetailsInput = z.input<ReturnType<typeof senderDetailsSchema>>;
type SenderDetailsOutput = z.output<ReturnType<typeof senderDetailsSchema>>;
export type SenderDetailsValues = SenderDetailsOutput;

const emptyInitialValue = {
  contactDetails: {
    type: 'phone',
    countryCode: 'ES',
    phoneNumber: '' as PhoneNumber
  }
} as SenderDetailsInput;

const SenderDetails: React.FC = () => {
  const { data } = useOnboardingStore();
  const { handleStepSubmit } = useStepSubmit();
  const { t } = useTranslation('onboarding');

  const methods = useI18nForm<SenderDetailsInput, unknown, SenderDetailsOutput>(
    senderDetailsSchema,
    {
      mode: 'onChange',
      defaultValues: data.senderDetails || emptyInitialValue
    },
    t
  );

  const {
    control,
    handleSubmit,
    formState: { isValid }
  } = methods;

  const { commonFormFieldProps } = useFormFieldCommonProps(methods);

  return (
    <form onSubmit={handleSubmit(handleStepSubmit)}>
      <div className="space-y-6">
        {/* Phone number */}
        <Controller
          control={control}
          name="contactDetails"
          render={({ field: { ref, value, ...restField }, formState }) => {
            const errorKey =
              formState.errors.contactDetails?.phoneNumber?.message ||
              formState.errors.contactDetails?.countryCode?.message;

            return (
              <PhoneInput
                ref={ref}
                value={{
                  type: 'phone',
                  countryCode: value.countryCode,
                  phoneNumber: value.phoneNumber as PhoneNumber
                }}
                {...commonFormFieldProps('contactDetails', {
                  label: t('senderDetails.formSenderNumber.label'),
                  placeholder: t('senderDetails.formSenderNumber.placeholder'),
                  resetValue: emptyInitialValue.contactDetails
                })}
                error={errorKey && errorKey}
                {...restField} // Registering the component this way due to it being the only "weird" one/different than Mantine's
              />
            );
          }}
        />

        <div className="text-sm text-gray-500 mt-4">{t('senderDetails.explanation')}</div>
      </div>
      <OnboardingNavigation canProceed={isValid} onProceed={handleSubmit(handleStepSubmit)} />
    </form>
  );
};

export default SenderDetails;
