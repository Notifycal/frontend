import { updateUserProfile } from '@api/userProfile';
import type { NotifycalI18nNamespaces } from '@common/i18n';
import { zodResolver } from '@hookform/resolvers/zod';
import { phoneByCountry } from '@notifycal/shared/i18n';
import type { CountryCode } from '@notifycal/shared/types';
import type { TFunction } from 'i18next';
import { z } from 'zod';

import { useStepSubmit } from '@hooks/useOnboardingStepSubmit';
import { useOnboardingStore } from '@store/useOnboardingStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';

import OnboardingNavigation from '@components/layout/onboarding/OnboardingNavigation';
import { errorPopUpTransition } from '@constants/animation';
import { Alert, Checkbox } from '@mantine/core';
import { IconExclamationCircle } from '@tabler/icons-react';
import { motion } from 'motion/react';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const finalSchema = (t: TFunction<NotifycalI18nNamespaces, undefined>) => z.object({
  termsAccepted: z.boolean().refine((value) => value === true, {
    message: t('confirm.formTosField.isRequired')
  }),
  privacyAccepted: z.boolean().refine((value) => value === true, {
    message: t('confirm.formPrivacyField.isRequired')
  }),
  marketingOptIn: z.boolean()
});
export type ConfirmValues = z.infer<ReturnType<typeof finalSchema>>;

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
  } = useForm<ConfirmValues>({
    resolver: zodResolver(finalSchema(t)),
    mode: 'onChange',
    defaultValues: {
      termsAccepted: data.confirm?.termsAccepted || false,
      privacyAccepted: data.confirm?.privacyAccepted || false,
      marketingOptIn: data.confirm?.marketingOptIn || false
    }
  });

  const reminderType = data.reminderType;
  const calendars = data.calendars?.calendars;
  const senderContactDetails = data.senderDetails?.contactDetails;

  const currentCountryCode = senderContactDetails?.countryCode as CountryCode;
  const dialCode = phoneByCountry[currentCountryCode].phoneDetails.dialCode;

  const canonicalFormattedPhoneNumber = `${dialCode} ${senderContactDetails?.phoneNumber}`;

  // useMemo only recomputes when the dependencies (2nd param array) change
  const calendarsWithTemplateInfo = useMemo(() => {
    if (!reminderType || !Array.isArray(calendars)) {
      return calendars || [];
    }

    return calendars.map((calendar) => ({
      ...calendar,
      template: {
        id: reminderType.reminderId,
        language: reminderType.reminderLanguage
      }
    }));
  }, [reminderType, calendars]);

  const mutation = useMutation({
    mutationFn: updateUserProfile,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['user-profile'] });
      await queryClient.refetchQueries({ queryKey: ['user-profile'] });
      await navigate({ to: '/wizard/completed'});
    },
    onError: () => {
      setError(t('confirm.apiError'));
    }
  });

  const onSubmit = async (formData: ConfirmValues): Promise<void> => {
    await handleStepSubmit(formData);
    // Submit all the data to the API

    const newData = {
      calendars: calendarsWithTemplateInfo,
      business: {
        name: data.businessDetails?.name,
        address: data.businessDetails?.address,
        senderContact: data.senderDetails?.contactDetails
      }
    };
    console.log(newData);
    mutation.mutate(newData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
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
