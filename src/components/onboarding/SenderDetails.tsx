import { isValidMobilePhoneNumber, type NotifycalI18nNamespaces } from '@common/i18n';
import { zodResolver } from '@hookform/resolvers/zod';
import { countryCodeSchema } from '@notifycal/shared/schemas';
import type { PhoneNumber } from '@notifycal/shared/types';
import type { TFunction } from 'i18next';
import { z } from 'zod';

import { useStepSubmit } from '@hooks/useOnboardingStepSubmit';
import { useOnboardingStore } from '@store/useOnboardingStore';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import OnboardingNavigation from '@components/layout/onboarding/OnboardingNavigation';
import PhoneInput from '../ui/PhoneInput/PhoneInput';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const senderDetailsSchema = (t: TFunction<NotifycalI18nNamespaces, undefined>) => z
  .object({
    contactDetails: z.object({
      type: z.literal('phone'),
      countryCode: countryCodeSchema,
      phoneNumber: z
        .string()
        .min(1, { message: t('senderDetails.formSenderNumber.isRequired') })
        .brand('PhoneNumber')
    })
  })
  .superRefine((data, context) => {
    if (!isValidMobilePhoneNumber(data.contactDetails.phoneNumber as PhoneNumber, data.contactDetails.countryCode)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: t('senderDetails.formSenderNumber.isInvalid'),
        path: ['contactDetails', 'phoneNumber']
      });
    }
  });

export type SenderDetailsValues = z.infer<ReturnType<typeof senderDetailsSchema>>;

const SenderDetails: React.FC = () => {
  const { data } = useOnboardingStore();
  const { handleStepSubmit } = useStepSubmit();
  const { t } = useTranslation('onboarding');

  const {
    control,
    handleSubmit,
    formState: { isValid }
  } = useForm<SenderDetailsValues>({
    resolver: zodResolver(senderDetailsSchema(t)),
    mode: 'onChange',
    defaultValues: {
      contactDetails: {
        type: 'phone',
        countryCode: data.senderDetails?.contactDetails.countryCode || 'ES',
        phoneNumber: data.senderDetails?.contactDetails.phoneNumber || ('' as PhoneNumber)
      }
    }
  });

  return (
    <form onSubmit={handleSubmit(handleStepSubmit)}>
      <div className="space-y-6">
        {/* Phone number */}
        <Controller
          control={control}
          name="contactDetails"
          render={({ field, formState }) => {
            const errorKey =
              formState.errors.contactDetails?.phoneNumber?.message ||
              formState.errors.contactDetails?.countryCode?.message;

            return (
              <PhoneInput
                error={errorKey && errorKey}
                label={t('senderDetails.formSenderNumber.label')}
                placeholder={t('senderDetails.formSenderNumber.placeholder')}
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

        <div className="text-sm text-gray-500 mt-4">{t('senderDetails.explanation')}</div>
      </div>
      <OnboardingNavigation canProceed={isValid} isLastStep={false} onProceed={handleSubmit(handleStepSubmit)} />
    </form>
  );
};

export default SenderDetails;
