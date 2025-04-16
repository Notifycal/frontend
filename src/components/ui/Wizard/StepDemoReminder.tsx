import { type DemoReminderPayload, sendDemoReminder } from '@api/reminder';
import type { FunctionComponent } from '@common/types';
import { Button } from '@mantine/core';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { DateTime } from 'luxon';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import type { StepBusinessDetailsValues } from './StepBusinessDetails';
import type { StepReminderTypeValues } from './StepReminderType';
import type { StepSenderDetailsValues } from './StepSenderDetails';
import type { Step } from './Wizard';

const StepDemoReminderSchema = z.object({});

const StepDemoReminderComponent = (): FunctionComponent => {
  const { watch } = useFormContext<
    StepReminderTypeValues & StepSenderDetailsValues & Pick<StepBusinessDetailsValues, 'business'>
  >();

  const selectedTemplateId = watch('id');
  const business = watch('business');
  const senderDetails = watch('contactDetails');

  const queryClient = useQueryClient();
  const sendReminderX = useMutation({
    mutationFn: sendDemoReminder,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['post-reminder'] });
      await queryClient.refetchQueries({ queryKey: ['post-reminder'] });
    },
    onError: (error) => {
      console.log(error);
    }
  });

  async function onNextStep(): Promise<void> {
    const demoReminderPayload: DemoReminderPayload = {
      template: {
        id: selectedTemplateId,
        fields: {
          business: business
        }
      },
      receiverDetails: senderDetails,
      startTime: {
        dateTime: DateTime.now().toISO(),
        timeZone: 'Europe/Madrid'
      }
    };
    await sendReminderX.mutateAsync(demoReminderPayload);
  }

  const { t } = useTranslation();
  return (
    <>
      <p className="text-sm md:text-base text-gray-600 mb-6">{t('onboarding.stepDemoReminder.msg1')}</p>
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
