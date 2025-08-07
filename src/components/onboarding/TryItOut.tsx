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
    receiverContact: z.object({
      type: z.literal('phone'),
      countryCode: countryCodeSchema,
      phoneNumber: z
        .string()
        .min(1, { message: t('tryItOut.formPhoneNumber.isRequired', { ns: 'onboarding' }) })
        .transform((value) => value as PhoneNumber)
    })
  }).superRefine((values, context) => {
    if (!isValidMobilePhoneNumber(values.receiverContact.phoneNumber, values.receiverContact.countryCode)) {
      context.addIssue({
        code: 'custom',
        message: t('tryItOut.formPhoneNumber.isInvalid', { ns: 'onboarding' }),
        path: ['receiverContact', 'phoneNumber']
      });
    }
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
  const { t } = useTranslation(['translations', 'onboarding']);

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
    formState: { isValid }
  } = methods;

  const { commonFormFieldProps } = useFormFieldCommonProps(methods);

  const sendDemoReminderMutation = useMutation({
    mutationFn: sendDemoReminder,
    onSuccess: async () => {
      setError(null);
      setValue('hasSentTestReminder', true, { shouldValidate: true });
      await queryClient.refetchQueries({ queryKey: ['user-profile'] });
      // Doing this to persist/"send" the form as soon as the button is clicked
      await handleSubmit(setTryItOutData)();
    },
    onError: () => {
      setError(t('tryItOut.apiError', { ns: 'onboarding' }));
    }
  });

  const hasSentTestReminderFromForm = watch('hasSentTestReminder');
  const hasSentTestReminderFromApi = user?.demoReminderCount === 1;
  const hasSentTestReminder = hasSentTestReminderFromForm || hasSentTestReminderFromApi;

  const receiverContactFromForm = watch('receiverContact');

  const onTestReminderSendButtonClick = (): void => {
    if (!hasSentTestReminder && isValid) {
      const demoReminderPayload = {
        startTime: {
          dateTime: DT.now().toUTC().toISO() as DateTime,
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone as TimeZone
        },
        receiverContact: {
          type: 'phone' as const,
          phoneNumber: receiverContactFromForm.phoneNumber as PhoneNumber,
          countryCode: receiverContactFromForm.countryCode
        }
      };

      sendDemoReminderMutation.mutate(demoReminderPayload);
    }
  };

  const nextButtonLabel = !hasSentTestReminder ? t('generic.skip', { ns: 'translations' }) : undefined;
  return (
    <form onSubmit={handleSubmit(handleStepSubmit)}>
      <div className="space-y-6">
        <Controller
          control={control}
          name="receiverContact"
          render={({ field: { ref, value, ...restField }, formState }) => {
            const errorKey =
              formState.errors.receiverContact?.phoneNumber?.message ||
              formState.errors.receiverContact?.countryCode?.message;

            return (
              <PhoneInput
                ref={ref}
                value={{
                  type: 'phone',
                  countryCode: value.countryCode,
                  phoneNumber: value.phoneNumber as PhoneNumber
                }}
                {...commonFormFieldProps('receiverContact', {
                  label: t('tryItOut.formPhoneNumber.label', { ns: 'onboarding' }),
                  placeholder: t('tryItOut.formPhoneNumber.placeholder', { ns: 'onboarding' }),
                  resetValue: emptyInitialValue.receiverContact
                })}
                error={errorKey && errorKey}
                {...restField}
              />
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
            disabled={hasSentTestReminder || !isValid}
            loading={sendDemoReminderMutation.isPending}
            onClick={onTestReminderSendButtonClick}
          >
            {t('tryItOut.sendTestReminder', { ns: 'onboarding' })}
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

      <OnboardingNavigation
        canProceed={isValid}
        nextButtonLabel={nextButtonLabel}
        onProceed={handleSubmit(handleStepSubmit)}
      />
    </form>
  );
};

export default TryItOut;
