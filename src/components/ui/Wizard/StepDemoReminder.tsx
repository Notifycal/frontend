import { sendDemoReminder } from '@api/demoReminder';
import { getUserProfile } from '@api/userProfile';
import phoneNotificationImg from '@assets/images/phone-notification.jpg';
import type { FunctionComponent } from '@common/types';
import { getLocalStorageItem, setLocalStorageItem } from '@common/utils';
import { Box, Button, Image, Stack, Text } from '@mantine/core';
import type { DateTime, DemoReminderPayload, PhoneContact, TimeZone } from '@notifycal/shared/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { DateTime as DT } from 'luxon';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import type { Step } from './Wizard';

const StepDemoReminderSchema = z.object({});

const StepDemoReminderComponent = (): FunctionComponent => {
  const { t } = useTranslation();
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

  const demoReminderSentLocalStoreKey = 'demoReminderSent';
  const readDemoReminderSentFromLocalStore = (): boolean => {
    const stringValue = getLocalStorageItem(demoReminderSentLocalStoreKey);
    try {
      return stringValue === 'true' ? true : false;
    } catch {
      return false;
    }
  };
  const [demoReminderSent, markDemoReminderAsSent] = useState<boolean>(readDemoReminderSentFromLocalStore());

  async function onNextStep(): Promise<void> {
    const senderDetails = userProfile.data?.config?.business.senderContact;
    if (senderDetails) {
      const demoReminderPayload: DemoReminderPayload = {
        receiverContact: senderDetails as PhoneContact, // This assertion is valid while RCS isn't implemented
        startTime: {
          dateTime: DT.now().toUTC().toISO() as DateTime,
          timeZone: 'Europe/Madrid' as TimeZone
        }
      };
      markDemoReminderAsSent(true);
      setLocalStorageItem(demoReminderSentLocalStoreKey, 'true');
      await _sendDemoReminder.mutateAsync(demoReminderPayload);
    }
  }

  return (
    <Stack align="center" justify="center">
      <Text maw={500} size="sm">
        {t('demoReminder.stepDemoReminder.msg1')}
      </Text>
      <Box>
        <Image alt="Phone Notification" fit="contain" maw={200} mx="auto" src={phoneNotificationImg} />
      </Box>

      <Button disabled={demoReminderSent} mx="auto" size="md" type="button" w="auto" onClick={onNextStep}>
        {t('demoReminder.stepDemoReminder.sendReminderButton')}
      </Button>

      <Text c="gray" maw={500} mt="sm" size="sm">
        {t('demoReminder.stepDemoReminder.msg2')}
      </Text>
    </Stack>
  );
};

export const StepDemoReminder: Step<typeof StepDemoReminderSchema> = {
  component: StepDemoReminderComponent,
  schema: StepDemoReminderSchema,
  defaultValues: {}
};
