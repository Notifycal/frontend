import Wizard, { type WizardConfig } from '@components/ui/Wizard/Wizard';

import { StepFive } from '@components/ui/Wizard/StepFive';
import { StepFour } from '@components/ui/Wizard/StepFour';
import { StepOne } from '@components/ui/Wizard/StepOne';
import { StepThree } from '@components/ui/Wizard/StepThree';
import { StepTwo } from '@components/ui/Wizard/StepTwo';

import { useNavigate } from '@tanstack/react-router';

import type { UserProfileBusinessDetails } from '@api/userProfile';
import { updateUserProfile } from '@api/userProfile';

import onboardingImg from '@assets/images/onboarding.png';

import type { FunctionComponent } from '@common/types';

const Onboarding = (): FunctionComponent => {
  const navigate = useNavigate();

  const onboardingConfig: WizardConfig<Record<string, unknown>> = [StepOne, StepTwo, StepThree, StepFour, StepFive];

  const onOnboardingFinish = async (data: UserProfileBusinessDetails): Promise<void> => {
    await updateUserProfile({
      BusinessAddress: data.businessAddress,
      BusinessCalendars: data.businessCalendars,
      BusinessName: data.businessNames
    });
    await navigate({ to: '/dashboard' });
  };

  return (
    <div className="container h-screen md:max-h-[500px] mx-auto bg-white shadow-sm rounded-lg lg:max-w-[66.6%]">
      <div className="flex flex-col md:flex-row h-full">
        <div
          className="flex-shrink-0 flex-grow-0 basis-2/5 md:basis-1/2 bg-cover bg-center overflow-hidden"
          style={{
            backgroundImage: `url(${onboardingImg})`
          }}
        ></div>
        <Wizard
          className="flex-shrink-0 flex-grow-0 basis-3/5 md:basis-1/2 px-6 py-12 h-full"
          handleFinish={onOnboardingFinish}
          header="Bienvenid@ a Notifycal"
          wizardSteps={onboardingConfig}
        />
      </div>
    </div>
  );
};

export default Onboarding;
