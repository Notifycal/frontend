import { StepBusinessDetails } from '@components/ui/Wizard/StepBusinessDetails';
import { StepCalendars } from '@components/ui/Wizard/StepCalendars';
import { StepSenderDetails } from '@components/ui/Wizard/StepSenderDetails';
import Wizard from '@components/ui/Wizard/Wizard';

import { updateUserProfile } from '@api/userProfile';
import { useNavigate } from '@tanstack/react-router';

import onboardingImg from '@assets/images/onboarding.png';

import type { FunctionComponent } from '@common/types';
import { StepFinal } from '@components/ui/Wizard/StepFinal';
import { StepWelcome } from '@components/ui/Wizard/StepWelcome';
import { useTranslation } from 'react-i18next';
import type { z } from 'zod';

import { StepDemoReminder } from '@components/ui/Wizard/StepDemoReminder';
import { StepReminderType } from '@components/ui/Wizard/StepReminderType';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

const Onboarding = (): FunctionComponent => {
  const onboardingStepsConfig = [StepWelcome, StepBusinessDetails, StepReminderType, StepCalendars, StepSenderDetails];
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const schema = StepWelcome.schema
    .merge(StepBusinessDetails.schema)
    // StepReminderType intentionally skipped cause the collected value then gets baked into StepCalendars selection
    .merge(StepCalendars.schema)
    .merge(StepSenderDetails.schema.innerType())
    .merge(StepFinal.schema)
    .strip();
  type FormResult = z.infer<typeof schema>;

  const demoReminderStepsConfig = [StepDemoReminder];

  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isOnboardingFinished, finishOnboarding] = useState<boolean>(false);

  const updateUser = useMutation({
    mutationFn: updateUserProfile,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['user-profile'] });
      await queryClient.refetchQueries({ queryKey: ['user-profile'] });
    },
    onError: (error) => {
      console.log(error);
    }
  });

  const onOnboardingFinish = async (data: FormResult): Promise<void> => {
    const result = {
      calendars: data.calendars,
      business: {
        ...data.business,
        senderContact: data.contactDetails
      }
    };
    await updateUser.mutateAsync(result).then();
    finishOnboarding(true);
  };

  const onDemoReminderFinish = async (): Promise<void> => {
    await navigate({ to: '/dashboard' });
  };

  return (
    <div className="container h-screen md:max-h-[600px] mx-auto bg-white shadow-xs rounded-lg lg:max-w-[66.6%]">
      <div className="flex flex-col md:flex-row h-full">
        <div
          className="shrink-0 grow-0 basis-2/5 md:basis-1/2 bg-cover bg-center overflow-hidden"
          style={{
            backgroundImage: `url(${onboardingImg})`
          }}
        ></div>
        {isOnboardingFinished ? (
          <Wizard
            key="demo"
            className="shrink-0 grow-0 basis-3/5 md:basis-1/2 px-6 py-12 h-full"
            handleFinish={onDemoReminderFinish}
            header={t('onboarding.stepDemoReminder.header')}
            wizardSteps={demoReminderStepsConfig}
            />
          ) : (
            <Wizard
            key="onboarding"
            className="shrink-0 grow-0 basis-3/5 md:basis-1/2 px-6 py-12 h-full"
            handleFinish={onOnboardingFinish}
            header={t('onboarding.stepWelcome.header')}
            wizardSteps={onboardingStepsConfig}
          />
        )}
      </div>
    </div>
  );
};

export default Onboarding;
