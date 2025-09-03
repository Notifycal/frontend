import { sendDemoReminder } from '@api/demoReminder';
import { getUserProfile } from '@api/userProfile';
import { type NotifycalTFunction, isValidMobilePhoneNumber } from '@common/i18n';
import { countryCodeSchema } from '@notifycal/shared/schemas';
import type { DateTime, PhoneNumber, TimeZone } from '@notifycal/shared/types';
import { DateTime as DT } from 'luxon';
import { z } from 'zod';

import { useFormFieldCommonProps } from '@hooks/useFormFieldCommonProps';
import { useI18nForm } from '@hooks/useI18nForm';
import { useStepSubmit } from '@hooks/useOnboardingStepSubmit';
import { useOnboardingStore } from '@store/useOnboardingStore';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import OnboardingNavigation from '@components/layout/onboarding/OnboardingNavigation';
import FlatError from '@components/ui/FlatError/FlatError';
import PhoneInput from '@components/ui/PhoneInput/PhoneInput';
import { Alert, Button, Image } from '@mantine/core';

import phoneNotificationImg from '@assets/images/phone-notification.jpg';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const tryItOutSchema = (t: NotifycalTFunction) => {
  return z.object({
    hasSentTestReminder: z.boolean(),
    receiverContact: z
      .object({
        type: z.literal('phone'),
        countryCode: countryCodeSchema,
        phoneNumber: z
          .string()
          .min(1, { message: t('tryItOut.formPhoneNumber.isRequired', { ns: 'onboarding' }) })
          .transform((value) => value as PhoneNumber)
      })
      .superRefine((value, context) => {
        if (!isValidMobilePhoneNumber(value.phoneNumber, value.countryCode)) {
          context.addIssue({
            code: 'custom',
            message: t('tryItOut.formPhoneNumber.isInvalid', { ns: 'onboarding' }),
            path: ['phoneNumber']
          });
        }
      })
      .optional()
  });
};

export type TryItOutInput = z.input<ReturnType<typeof tryItOutSchema>>;
export type TryItOutOutput = z.output<ReturnType<typeof tryItOutSchema>>;
export type TryItOutValues = TryItOutOutput;

const emptyInitialValue = {
  hasSentTestReminder: false,
  receiverContact: {
    type: 'phone',
    countryCode: 'ES',
    phoneNumber: '' as PhoneNumber
  }
} as TryItOutInput;

const TryItOut: React.FC = () => {
  const { data, setStepData } = useOnboardingStore();
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { handleStepSubmit } = useStepSubmit();
  const { t } = useTranslation(['translation', 'onboarding']);

  const setTryItOutData = setStepData.bind(null, 'tryItOut');

  const { data: user } = useQuery({
    queryKey: ['user-profile'],
    queryFn: getUserProfile,
    retry: false
  });

  const methods = useI18nForm<TryItOutInput, unknown, TryItOutOutput>(
    tryItOutSchema,
    {
      mode: 'onChange',
      defaultValues: data.tryItOut || emptyInitialValue
    },
    t
  );

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = methods;

  const { commonFormFieldProps } = useFormFieldCommonProps(methods);

  const sendDemoReminderMutation = useMutation({
    mutationFn: sendDemoReminder,
    onSuccess: async () => {
      setError(null);
      setValue('hasSentTestReminder', true, { shouldValidate: true });
      await queryClient.refetchQueries({ queryKey: ['user-profile'] });
      await handleSubmit(setTryItOutData)();
    },
    onError: () => {
      setError(t('tryItOut.apiError', { ns: 'onboarding' }));
    }
  });

  const hasSentTestReminderFromForm = watch('hasSentTestReminder');
  const hasSentTestReminderFromApi = (user?.demoReminderCount || 0) >= 1;
  const hasSentTestReminder = hasSentTestReminderFromForm || hasSentTestReminderFromApi;

  const receiverContact = watch('receiverContact');
  const hasValidPhoneNumber = receiverContact?.countryCode && receiverContact.phoneNumber && !errors.receiverContact;

  const onTestReminderSendButtonClick = (): void => {
    if (!hasSentTestReminder && hasValidPhoneNumber && receiverContact) {
      const demoReminderPayload = {
        startTime: {
          dateTime: DT.now().toUTC().toISO() as DateTime,
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone as TimeZone
        },
        receiverContact: {
          type: 'phone' as const,
          phoneNumber: receiverContact.phoneNumber as PhoneNumber,
          countryCode: receiverContact.countryCode
        }
      };

      sendDemoReminderMutation.mutate(demoReminderPayload);
    }
  };

  const onNavigationProceed = (): Promise<void> => {
    const currentData = {
      hasSentTestReminder: hasSentTestReminder,
      receiverContact: receiverContact
        ? {
            ...receiverContact,
            phoneNumber: receiverContact.phoneNumber as PhoneNumber
          }
        : undefined
    };
    setTryItOutData(currentData);
    return handleStepSubmit(currentData);
  };

  const nextButtonLabel = !hasSentTestReminder ? t('generic.skip', { ns: 'translation' }) : undefined;
  return (
    <form onSubmit={handleSubmit(handleStepSubmit)}>
      <div className="space-y-6">
        <Controller
          control={control}
          name="receiverContact"
          render={({ field: { ref, value, ...restField } }) => {
            const errorKey =
              errors.receiverContact?.phoneNumber?.message || errors.receiverContact?.countryCode?.message;

            return !hasSentTestReminder ? (
              <PhoneInput
                ref={ref}
                value={{
                  type: 'phone',
                  countryCode: value?.countryCode || 'ES',
                  phoneNumber: (value?.phoneNumber || '') as PhoneNumber
                }}
                {...commonFormFieldProps('receiverContact', {
                  label: t('tryItOut.formPhoneNumber.label', { ns: 'onboarding' }),
                  placeholder: t('tryItOut.formPhoneNumber.placeholder', { ns: 'onboarding' }),
                  resetValue: emptyInitialValue.receiverContact
                })}
                error={errorKey}
                {...restField}
              />
            ) : (
              <></>
            );
          }}
        />

        <div className="flex flex-col">
          <Image
            alt={t('tryItOut.imageAlt', { ns: 'onboarding' })}
            fit="contain"
            maw={200}
            mx="auto"
            src={phoneNotificationImg}
          />

          <Button
            disabled={hasSentTestReminder || !hasValidPhoneNumber}
            loading={sendDemoReminderMutation.isPending}
            onClick={onTestReminderSendButtonClick}
          >
            {hasSentTestReminder
              ? t('tryItOut.testReminderSent', { ns: 'onboarding' })
              : t('tryItOut.sendTestReminder', { ns: 'onboarding' })}
          </Button>
        </div>

        <div className="text-sm text-gray-500 mt-4">{t('tryItOut.explanation', { ns: 'onboarding' })}</div>
        <Alert color="blue" variant="light">
          <div className="text-sm text-gray-500">{t('tryItOut.warning', { ns: 'onboarding' })}</div>
        </Alert>
        {/* Error Message from API */}
        {!sendDemoReminderMutation.isPending && sendDemoReminderMutation.isError && error && (
          <FlatError
            onErrorClose={() => {
              setError(null);
            }}
          >
            {error}
          </FlatError>
        )}
      </div>

      <OnboardingNavigation canProceed nextButtonLabel={nextButtonLabel} onProceed={onNavigationProceed} />
    </form>
  );
};

export default TryItOut;
