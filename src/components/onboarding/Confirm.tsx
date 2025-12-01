import { getUserProfile, updateUserProfile } from '@api/userProfile';
import type { NotifycalTFunction } from '@common/i18n';
import type { ParseKeys } from 'i18next';
import { z } from 'zod';

import { useI18nForm } from '@hooks/useI18nForm';
import { useOnboardingNavigation } from '@hooks/useOnboardingNavigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import OnboardingNavigation from '@components/layout/onboarding/OnboardingNavigation';
import AccountOverview from '@components/ui/AccountOverview/AccountOverview';
import FlatError from '@components/ui/FlatError/FlatError';
import { Checkbox } from '@mantine/core';
import { Link } from '@tanstack/react-router';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const confirmSchema = (t: NotifycalTFunction) =>
  z.object({
    termsAccepted: z.preprocess(
      (value) => value === true,
      z.literal(true, {
        message: t('confirm.formTosField.isRequired')
      })
    ),
    privacyAccepted: z.preprocess(
      (value) => value === true,
      z.literal(true, {
        message: t('confirm.formPrivacyField.isRequired')
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
  const { onboardingData, handleStepData, requireDataFromSteps, handleForwardNavigation } = useOnboardingNavigation();
  const { businessDetails, senderDetails, reminderType, calendars } = requireDataFromSteps([
    'businessDetails',
    'senderDetails',
    'reminderType',
    'calendars'
  ]);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation('onboarding');

  const {
    handleSubmit,
    register,
    formState: { errors, isValid }
  } = useI18nForm<ConfirmInput, unknown, ConfirmOutput>(
    confirmSchema,
    {
      mode: 'onChange',
      defaultValues: onboardingData.confirm || emptyInitialValue
    },
    t
  );

  const calendarsWithTemplateInfo = calendars.calendars.map((calendar) => ({
    ...calendar,
    template: {
      id: reminderType.reminderId,
      language: reminderType.reminderLanguage
    }
  }));

  const queryClient = useQueryClient();

  const saveUserProfileMutation = useMutation({
    mutationFn: updateUserProfile,
    onSuccess: async () => {
      setError(null);
      const userProfile = await queryClient.fetchQuery({ queryKey: ['user-profile'], queryFn: getUserProfile });
      await handleForwardNavigation(userProfile.userStatus);
    },
    onError: () => {
      setError(t('confirm.apiError'));
    }
  });

  const submitUserProfile = async (confirmationFormData: ConfirmValues): Promise<void> => {
    handleStepData(confirmationFormData);

    const newData = {
      calendars: calendarsWithTemplateInfo,
      business: {
        ...businessDetails,
        senderContact: senderDetails.senderContact
      },
      confirmation: confirmationFormData
    };
    await saveUserProfileMutation.mutateAsync(newData);
  };

  const checkboxes: Array<{
    name: keyof ConfirmInput;
    i18nKey?: ParseKeys<'onboarding'>;
    label?: string;
    path?: string;
  }> = [
    {
      name: 'termsAccepted',
      i18nKey: 'confirm.formTosField.label',
      path: '/terms-and-conditions'
    },
    {
      name: 'privacyAccepted',
      i18nKey: 'confirm.formPrivacyField.label',
      path: '/privacy-policy'
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
          {checkboxes.map(({ name, i18nKey, label, path }) => (
            <Checkbox
              key={name}
              className="mt-1"
              label={
                i18nKey && path ? (
                  <Trans
                    className="text-sm text-gray-700"
                    components={[<Link rel="noopener noreferrer" target="_blank" to={path} />]}
                    i18nKey={i18nKey}
                    ns="onboarding"
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
