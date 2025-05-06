import { updateUserProfile } from '@api/userProfile';
import type { NotifycalTFunction } from '@common/i18n';
import { phoneByCountry } from '@notifycal/shared/i18n';
import type {
  BusinessAddress,
  BusinessName,
  CountryCode,
  LanguageCode,
  PhoneNumber,
  TemplateId
} from '@notifycal/shared/types';
import { z } from 'zod';

import { useI18nForm } from '@hooks/useI18nForm';
import { useStepSubmit } from '@hooks/useOnboardingStepSubmit';
import { useOnboardingStore } from '@store/useOnboardingStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import OnboardingNavigation from '@components/layout/onboarding/OnboardingNavigation';
import { errorPopUpTransition } from '@constants/animation';
import { Alert, Checkbox } from '@mantine/core';
import { IconExclamationCircle } from '@tabler/icons-react';
import { motion } from 'motion/react';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const confirmSchema = (t: NotifycalTFunction) =>
  z.object({
    termsAccepted: z.boolean().refine((value) => value === true, {
      message: t('confirm.formTosField.isRequired')
    }),
    privacyAccepted: z.boolean().refine((value) => value === true, {
      message: t('confirm.formPrivacyField.isRequired')
    }),
    marketingOptIn: z.boolean()
  });
export type ConfirmValues = z.infer<ReturnType<typeof confirmSchema>>;

const errorFields = ['privacyAccepted', 'termsAccepted'] as const;

const Confirm: React.FC = () => {
  const { data } = useOnboardingStore();
  const [error, setError] = useState<string | null>(null);
  const { handleStepSubmit } = useStepSubmit();
  const { t } = useTranslation('onboarding');
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const {
    handleSubmit,
    register,
    formState: { errors, isValid }
  } = useI18nForm<ConfirmValues>(
    confirmSchema,
    {
      mode: 'onChange',
      defaultValues: {
        termsAccepted: data.confirm?.termsAccepted || false,
        privacyAccepted: data.confirm?.privacyAccepted || false,
        marketingOptIn: data.confirm?.marketingOptIn || false
      }
    },
    t
  );

  const reminderType = data.reminderType;
  const calendars = data.calendars?.calendars;
  const senderContactDetails = data.senderDetails?.contactDetails;

  const currentCountryCode = senderContactDetails?.countryCode as CountryCode;
  const dialCode = phoneByCountry[currentCountryCode].phoneDetails.dialCode;

  const canonicalFormattedPhoneNumber = `${dialCode} ${senderContactDetails?.phoneNumber}`;

  // useMemo only recomputes when the dependencies (2nd param array) change
  const calendarsWithTemplateInfo = useMemo(() => {
    return (calendars || []).map((calendar) => ({
      ...calendar,
      template: {
        id: (reminderType?.reminderId || '') as TemplateId,
        language: (reminderType?.reminderLanguage || '') as LanguageCode
      }
    }));
  }, [reminderType, calendars]);

  const mutation = useMutation({
    mutationFn: updateUserProfile,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['user-profile'] });
      await queryClient.refetchQueries({ queryKey: ['user-profile'] });
      await navigate({ to: '/onboarding/completed' });
    },
    onError: () => {
      setError(t('confirm.apiError'));
    }
  });

  const submitUserProfile = async (formData: ConfirmValues): Promise<void> => {
    await handleStepSubmit(formData);
    // Submit all the data to the API

    const newData = {
      calendars: calendarsWithTemplateInfo,
      business: {
        name: (data.businessDetails?.name || '') as BusinessName,
        address: (data.businessDetails?.address || '') as BusinessAddress,
        senderContact: data.senderDetails?.contactDetails || {
          type: 'phone',
          phoneNumber: '' as PhoneNumber,
          countryCode: '' as CountryCode
        }
      }
    };
    mutation.mutate(newData);
  };

  return (
    <form onSubmit={handleSubmit(submitUserProfile)}>
      <div className="space-y-6">
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">{t('confirm.accountSummary')}</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 xl:gap-4 text-sm">
            <div>
              <p className="text-gray-500">{t('businessDetails.formNameField.label')}</p>
              <p className="font-medium">{data.businessDetails?.name}</p>
            </div>

            <div>
              <p className="text-gray-500">{t('businessDetails.formAddressField.label')}</p>
              <p className="font-medium">{data.businessDetails?.address}</p>
            </div>

            <div>
              <p className="text-gray-500">{t('senderDetails.title')}</p>
              <p className="font-medium">{canonicalFormattedPhoneNumber}</p>
            </div>

            {data.businessDetails && data.businessDetails.companyIndustry && (
              <div>
                <p className="text-gray-500">{t('businessDetails.formIndustryField.label')}</p>
                <p className="font-medium">{t(`businessDetails.industries.${data.businessDetails.companyIndustry}`)}</p>
              </div>
            )}

            <div>
              <p className="text-gray-500">{t('calendars.title')}</p>
              {data.calendars?.calendars.map(({ id, name }) => (
                <p key={id} className="font-medium">
                  {name}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* Terms & Agreements */}
        <div className="space-y-3">
          <div className="flex items-start">
            <div className="flex items-center h-5 mt-1">
              <Checkbox
                label={
                  <label className="text-sm text-gray-700" htmlFor="termsAccepted">
                    <Trans
                      i18nKey="confirm.formTosField.label"
                      ns="onboarding"
                      components={[
                        <a
                          className="text-primary-600 hover:underline"
                          href="#"
                          rel="noopener noreferrer"
                          target="_blank"
                        />
                      ]}
                    />
                  </label>
                }
                {...register('termsAccepted')}
              />
            </div>
          </div>

          <div className="flex items-start">
            <div className="flex items-center h-5 mt-1">
              <Checkbox
                label={
                  <label className="text-sm text-gray-700" htmlFor="privacyAccepted">
                    <Trans
                      i18nKey="confirm.formPrivacyField.label"
                      ns="onboarding"
                      components={[
                        <a
                          className="text-primary-600 hover:underline"
                          href="#"
                          rel="noopener noreferrer"
                          target="_blank"
                        />
                      ]}
                    />
                  </label>
                }
                {...register('privacyAccepted')}
              />
            </div>
          </div>
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
        {error && (
          <motion.div key="error-alert" {...errorPopUpTransition}>
            <Alert
              withCloseButton
              color="pink"
              icon={<IconExclamationCircle />}
              radius="md"
              title={t('generic.error', { ns: 'translations' })}
              variant="light"
              onClose={() => {
                setError(null);
              }}
            >
              {error}
            </Alert>
          </motion.div>
        )}
      </div>

      <OnboardingNavigation
        isLastStep
        canProceed={isValid}
        isSubmitting={mutation.isPending}
        onProceed={handleSubmit(onSubmit)}
      />
    </form>
  );
};

export default Confirm;
