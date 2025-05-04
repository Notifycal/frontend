import { zodResolver } from '@hookform/resolvers/zod';
import { DateTime as DT } from 'luxon';
import { z } from 'zod';

import { useStepSubmit } from '@hooks/useOnboardingStepSubmit';
import { useOnboardingStore } from '@store/useOnboardingStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { sendDemoReminder } from '@api/demoReminder';
import { errorPopUpTransition } from '@constants/animation';
import type { DateTime, PhoneContact, TimeZone } from '@notifycal/shared/types';

import OnboardingNavigation from '@components/layout/onboarding/OnboardingNavigation';
import { Alert, Button, Image } from '@mantine/core';
import { IconExclamationCircle } from '@tabler/icons-react';
import { motion } from 'motion/react';

import phoneNotificationImg from '@assets/images/phone-notification.jpg';

const tryItOutSchema = z.object({
  hasSentTestReminder: z.boolean()
});

export type TryItOutValues = z.infer<typeof tryItOutSchema>;

const TryItOut: React.FC = () => {
  const { data, setStepData } = useOnboardingStore();
  const [error, setError] = useState<string | null>(null);

  const { handleStepSubmit } = useStepSubmit();
  const { t } = useTranslation('onboarding');
  const queryClient = useQueryClient();

  const setTryItOutData = setStepData.bind(null, 'tryItOut');

  const { handleSubmit, setValue, watch } = useForm<TryItOutValues>({
    resolver: zodResolver(tryItOutSchema),
    mode: 'onChange',
    defaultValues: {
      hasSentTestReminder: data.tryItOut?.hasSentTestReminder || false
    }
  });

  const sendDemoReminderMutation = useMutation({
    mutationFn: sendDemoReminder,
    onSuccess: async () => {
      setValue('hasSentTestReminder', true, { shouldValidate: true });
      // Doing this to persist/"send" the form as soon as the button is clicked
      await handleSubmit(setTryItOutData)();

      await queryClient.invalidateQueries({ queryKey: ['post-reminder'] });
      await queryClient.refetchQueries({ queryKey: ['post-reminder'] });
    },
    onError: () => {
      setError(t('tryItOut.apiError'));
    }
  });

  const hasSentTestReminder = watch('hasSentTestReminder');

  const onTestReminderSendButtonClick = (): void => {
    if (!hasSentTestReminder) {
      // API call goes here
      const demoReminderPayload = {
        receiverContact: data.senderDetails?.contactDetails as PhoneContact,
        startTime: {
          dateTime: DT.now().toUTC().toISO() as DateTime,
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone as TimeZone
        }
      };

      sendDemoReminderMutation.mutate(demoReminderPayload);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleStepSubmit)}>
      <div className="space-y-6">
        <div className="flex flex-col">
          <Image alt={t('tryItOut.imageAlt')} fit="contain" maw={200} mx="auto" src={phoneNotificationImg} />

          <Button disabled={hasSentTestReminder} loading={sendDemoReminderMutation.isPending} onClick={onTestReminderSendButtonClick}>
            {t('tryItOut.sendTestReminder')}
          </Button>
        </div>

        <div className="text-sm text-gray-500 mt-4">{t('tryItOut.explanation')}</div>
        {/* Error Message from API */}
        {error && (
          <motion.div
            key="error-alert"
            {...errorPopUpTransition}
          >
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

      <OnboardingNavigation canProceed isLastStep={false} onProceed={handleSubmit(handleStepSubmit)} />
    </form>
  );
};

export default TryItOut;
