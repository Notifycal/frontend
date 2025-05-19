import { updateUserProfile } from '@api/userProfile';
import type { NotifycalTFunction } from '@common/i18n';
import { requireOnboardingSteps } from '@constants/onboardingSteps';
import type { ParseKeys } from 'i18next';
import { z } from 'zod';

import { useI18nForm } from '@hooks/useI18nForm';
import { useStepSubmit } from '@hooks/useOnboardingStepSubmit';
import { useOnboardingStore } from '@store/useOnboardingStore';
import { useMutation } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import OnboardingNavigation from '@components/layout/onboarding/OnboardingNavigation';
import AccountOverview from '@components/ui/AccountOverview/AccountOverview';
import FlatError from '@components/ui/FlatError/FlatError';
import { Checkbox } from '@mantine/core';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const confirmSchema = (t: NotifycalTFunction) =>
  z.object({
    termsAccepted: z.preprocess(
      (value) => value === true,
      z.literal(true, {
        errorMap: () => ({
          message: t('confirm.formTosField.isRequired')
        })
      })
    ),
    privacyAccepted: z.preprocess(
      (value) => value === true,
      z.literal(true, {
        errorMap: () => ({
          message: t('confirm.formPrivacyField.isRequired')
        })
      })
    ),
    marketingOptInAccepted: z.boolean()
  });

type ConfirmInput = z.input<ReturnType<typeof confirmSchema>>;
type ConfirmOutput = z.output<ReturnType<typeof confirmSchema>>;
export type ConfirmValues = ConfirmOutput;

const errorFields = ['privacyAccepted', 'termsAccepted'] as const;

const emptyInitialValue = {
  termsAccepted: false,
  privacyAccepted: false,
  marketingOptInAccepted: false
} as ConfirmInput;

const Confirm: React.FC = () => {
  const { data } = useOnboardingStore();
  const { businessDetails, senderDetails, reminderType, calendars } = requireOnboardingSteps(data, [
    'businessDetails',
    'senderDetails',
    'reminderType',
    'calendars'
  ]);
  const [error, setError] = useState<string | null>(null);
  const { handleStepNavigation, handleStepData } = useStepSubmit();
  const { t } = useTranslation('onboarding');

  const {
    handleSubmit,
    register,
    formState: { errors, isValid }
  } = useI18nForm<ConfirmInput, unknown, ConfirmOutput>(
    confirmSchema,
    {
      mode: 'onChange',
      defaultValues: data.confirm || emptyInitialValue
    },
    t
  );

  const calendarsWithTemplateInfo = useMemo(() => {
    return calendars.calendars.map((calendar) => ({
      ...calendar,
      template: {
        id: reminderType.reminderId,
        language: reminderType.reminderLanguage
      }
    }));
  }, [reminderType, calendars.calendars]);

  const saveUserProfileMutation = useMutation({
    mutationFn: updateUserProfile,
    onSuccess: async () => {
      setError(null);
      await handleStepNavigation();
    },
    onError: () => {
      setError(t('confirm.apiError'));
    }
  });

  const submitUserProfile = (confirmationFormData: ConfirmValues): void => {
    handleStepData(confirmationFormData);

    const newData = {
      calendars: calendarsWithTemplateInfo,
      business: {
        ...businessDetails,
        senderContact: senderDetails.senderContact
      },
      confirmation: confirmationFormData
    };
    saveUserProfileMutation.mutate(newData);
  };

  const checkboxes: Array<{
    name: keyof ConfirmInput;
    i18nKey?: ParseKeys<'onboarding'>;
    label?: string;
    url?: string;
  }> = [
    {
      name: 'termsAccepted',
      i18nKey: 'confirm.formTosField.label',
      url: 'https://TODO/TOS'
    },
    {
      name: 'privacyAccepted',
      i18nKey: 'confirm.formPrivacyField.label',
      url: 'https://TODO/Privacy'
    },
    {
      name: 'marketingOptInAccepted',
      label: t('confirm.formMarketingField.label')
    }
  ];

  return (
    <form onSubmit={handleSubmit(submitUserProfile)}>
      <div className="space-y-6">
        <AccountOverview businessDetails={businessDetails} calendars={calendars} senderDetails={senderDetails} />

        {/* Terms & Agreements */}
        <div className="space-y-3">
          {checkboxes.map(({ name, i18nKey, label, url }) => (
            <Checkbox
              key={name}
              className="mt-1"
              label={
                i18nKey && url ? (
                  <Trans
                    className="text-sm text-gray-700"
                    i18nKey={i18nKey}
                    ns="onboarding"
                    components={[
                      <a
                        className="text-primary-600 hover:underline"
                        href={url}
                        rel="noopener noreferrer"
                        target="_blank"
                      />
                    ]}
                  />
                ) : (
                  label
                )
              }
              {...register(name)}
            />
          ))}
        </div>

        {/* Error Message from validation */}
        {errorFields.some((field) => errors[field]) && (
          <div className="mt-2 space-y-1">
            <ul>
              {errorFields.map((field) => {
                const error = errors[field];
                return error ? (
                  <li key={field} className="text-sm text-red-600">
                    {error.message}
                  </li>
                ) : null;
              })}
            </ul>
          </div>
        )}
        {/* Error Message from API */}
        {!saveUserProfileMutation.isPending && saveUserProfileMutation.isError && error && (
          <FlatError
            onErrorClose={() => {
              setError(null);
            }}
          >
            {error}
          </FlatError>
        )}
      </div>

      <OnboardingNavigation
        canProceed={isValid}
        isSubmitting={saveUserProfileMutation.isPending}
        onProceed={handleSubmit(submitUserProfile)}
      />
    </form>
  );
};

export default Confirm;
