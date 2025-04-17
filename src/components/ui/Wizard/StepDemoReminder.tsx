import { sendDemoReminder } from '@api/reminder';
import { getUserProfile } from '@api/userProfile';
import phoneNotificationImg from '@assets/images/phone-notification.svg';
import type { FunctionComponent } from '@common/types';
import { Button, Image } from '@mantine/core';
import type { DateTime, DemoReminderPayload, PhoneContact, TimeZone } from '@notifycal/shared/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { DateTime as DT } from 'luxon';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import type { Step } from './Wizard';

const StepDemoReminderSchema = z.object({});

const StepDemoReminderComponent = (): FunctionComponent => {
  const queryClient = useQueryClient();
  const _sendDemoReminder = useMutation({
    mutationFn: sendDemoReminder,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['post-reminder'] });
      await queryClient.refetchQueries({ queryKey: ['post-reminder'] });
    },
    onError: (error) => {
      console.log(error);
    }
  });

  const userProfile = useQuery({
    queryKey: ['user-profile'],
    queryFn: getUserProfile
  });

  async function onNextStep(): Promise<void> {
    const senderDetails = userProfile.data?.config?.business.senderContact;
    if (senderDetails) {
      const demoReminderPayload: DemoReminderPayload = {
        receiverContact: senderDetails as PhoneContact, // This assertion is valid while RCS isn't implemented
        startTime: {
          dateTime: DT.now().toISO() as DateTime,
          timeZone: 'Europe/Madrid' as TimeZone
        }
      };
      await _sendDemoReminder.mutateAsync(demoReminderPayload);
    }
  }

  const { t } = useTranslation();
  return (
    <>
      <p className="text-sm md:text-base text-gray-600 mb-6">{t('onboarding.stepDemoReminder.msg1')}</p>
      <Image alt="Phone Notification" h={200} radius="sm" src={phoneNotificationImg} w="auto" />
      <Button type="button" onClick={onNextStep}>
        Send Reminder
      </Button>
    </>
  );
};

export const StepDemoReminder: Step<typeof StepDemoReminderSchema> = {
  component: StepDemoReminderComponent,
  schema: StepDemoReminderSchema,
  defaultValues: {}
};
