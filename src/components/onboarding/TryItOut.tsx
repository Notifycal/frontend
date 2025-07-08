import { sendDemoReminder } from '@api/demoReminder';
import { getUserProfile } from '@api/userProfile';
import type { DateTime, TimeZone } from '@notifycal/shared/types';
import { DateTime as DT } from 'luxon';
import { z } from 'zod';

import { useI18nForm } from '@hooks/useI18nForm';
import { useStepSubmit } from '@hooks/useOnboardingStepSubmit';
import { useOnboardingStore } from '@store/useOnboardingStore';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import OnboardingNavigation from '@components/layout/onboarding/OnboardingNavigation';
import FlatError from '@components/ui/FlatError/FlatError';
import { Button, Image } from '@mantine/core';

import phoneNotificationImg from '@assets/images/phone-notification.jpg';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const tryItOutSchema = () =>
  z.object({
    hasSentTestReminder: z.boolean()
  });

export type TryItOutInput = z.input<ReturnType<typeof tryItOutSchema>>;
export type TryItOutOutput = z.output<ReturnType<typeof tryItOutSchema>>;
export type TryItOutValues = TryItOutOutput;

const emptyInitialValue = {
  hasSentTestReminder: false
} as TryItOutInput;

const TryItOut: React.FC = () => {
  const { data, setStepData } = useOnboardingStore();
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { handleStepSubmit } = useStepSubmit();
  const { t } = useTranslation('onboarding');

  const setTryItOutData = setStepData.bind(null, 'tryItOut');

  const { data: user } = useQuery({
    queryKey: ['user-profile'],
    queryFn: getUserProfile,
    retry: false
  });

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { isValid }
  } = useI18nForm<TryItOutInput, unknown, TryItOutOutput>(
    tryItOutSchema,
    {
      mode: 'onChange',
      defaultValues: data.tryItOut || emptyInitialValue
    },
    t
  );

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
      setError(t('tryItOut.apiError'));
    }
  });

  const hasSentTestReminderFromForm = watch('hasSentTestReminder');
  const hasSentTestReminderFromApi = user?.demoReminderCount === 1;
  const hasSentTestReminder = hasSentTestReminderFromForm || hasSentTestReminderFromApi;

  const onTestReminderSendButtonClick = (): void => {
    if (!hasSentTestReminder) {
      const demoReminderPayload = {
        startTime: {
          dateTime: DT.now().toUTC().toISO() as DateTime,
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone as TimeZone
        }
      };

      sendDemoReminderMutation.mutate(demoReminderPayload);
    }
  };

  const nextButtonLabel = !hasSentTestReminder ? t('generic.skip', { ns: 'translations' }) : undefined;

  return (
    <form onSubmit={handleSubmit(handleStepSubmit)}>
      <div className="space-y-6">
        <div className="flex flex-col">
          <Image alt={t('tryItOut.imageAlt')} fit="contain" maw={200} mx="auto" src={phoneNotificationImg} />

          <Button
            disabled={hasSentTestReminder}
            loading={sendDemoReminderMutation.isPending}
            onClick={onTestReminderSendButtonClick}
          >
            {t('tryItOut.sendTestReminder')}
          </Button>
        </div>

        <div className="text-sm text-gray-500 mt-4">{t('tryItOut.explanation')}</div>
        <div className="text-[10px] text-amber-500/50">{t('tryItOut.warning')}</div>
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
