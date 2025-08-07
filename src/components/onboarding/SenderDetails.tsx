import type { NotifycalTFunction } from '@common/i18n';
import type { SMSSenderId } from '@notifycal/shared/types';
import { z } from 'zod';

import { useFormFieldCommonProps } from '@hooks/useFormFieldCommonProps';
import { useI18nForm } from '@hooks/useI18nForm';
import { useStepSubmit } from '@hooks/useOnboardingStepSubmit';
import { useOnboardingStore } from '@store/useOnboardingStore';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';

import OnboardingNavigation from '@components/layout/onboarding/OnboardingNavigation';
import { requireOnboardingSteps } from '@constants/onboardingSteps';
import { TextInput } from '@mantine/core';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const senderDetailsSchema = (t: NotifycalTFunction) => {
  const customSmsSenderSchema = z.object({
    type: z.literal('sms'),
    identifier: z
      .string({ message: t('senderDetails.formSenderId.isInvalid', { ns: 'onboarding' }) })
      .min(1, { message: t('senderDetails.formSenderId.isInvalid', { ns: 'onboarding' }) })
      .max(11, { message: t('senderDetails.formSenderId.isInvalid', { ns: 'onboarding' }) })
      .regex(/^[abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 ]+$/, {
        message: t('senderDetails.formSenderId.isInvalid', { ns: 'onboarding' })
      })
      .transform((data) => data as SMSSenderId)
  });

  return z.object({
    senderContact: customSmsSenderSchema
  });
};
type SenderDetailsInput = z.input<ReturnType<typeof senderDetailsSchema>>;
type SenderDetailsOutput = z.output<ReturnType<typeof senderDetailsSchema>>;
export type SenderDetailsValues = SenderDetailsOutput;

const SenderDetails: React.FC = () => {
  const { data } = useOnboardingStore();
  const { handleStepSubmit } = useStepSubmit();
  const { t } = useTranslation('onboarding');

  const { businessDetails } = requireOnboardingSteps(data, ['businessDetails']);

  const emptyInitialValue: SenderDetailsInput = {
    senderContact: {
      type: 'sms',
      identifier: businessDetails.name as unknown as SMSSenderId
    }
  };

  const methods = useI18nForm<SenderDetailsInput, unknown, SenderDetailsOutput>(
    senderDetailsSchema,
    {
      mode: 'onChange',
      defaultValues: data.senderDetails || emptyInitialValue
    },
    t
  );

  const {
    register,
    handleSubmit,
    trigger,
    formState: { isValid }
  } = methods;

  const { commonFormFieldProps } = useFormFieldCommonProps(methods);

  useEffect(() => {
    // Because we preset business name as sender ID, it is possible it is not valid.
    void trigger();
  }, [trigger]);

  return (
    <form onSubmit={handleSubmit(handleStepSubmit)}>
      <div className="space-y-6">
        <TextInput
          {...commonFormFieldProps('senderContact.identifier', {
            label: t('senderDetails.formSenderId.label'),
            placeholder: t('senderDetails.formSenderId.placeholder'),
            resetValue: '',
            registration: register('senderContact.identifier')
          })}
        />

        <div className="text-sm text-gray-500 mt-4">{t('senderDetails.explanation')}</div>
      </div>
      <OnboardingNavigation canProceed={isValid} onProceed={handleSubmit(handleStepSubmit)} />
    </form>
  );
};

export default SenderDetails;
