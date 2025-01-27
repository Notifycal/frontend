import Wizard from '@components/ui/Wizard/Wizard';
import { StepFour } from '@components/ui/Wizard/StepFour';
import { StepThree } from '@components/ui/Wizard/StepThree';
import { StepTwo } from '@components/ui/Wizard/StepTwo';

import { useNavigate } from '@tanstack/react-router';
import { updateUserProfile, type UserProfileBusinessDetails } from '@api/userProfile';

import onboardingImg from '@assets/images/onboarding.png';

import type { FunctionComponent } from '@common/types';
import type { z } from 'zod';
import { StepOne } from '@components/ui/Wizard/StepOne';
import { StepFive } from '@components/ui/Wizard/StepFive';

const Onboarding = (): FunctionComponent => {
  const stepsConfig = [StepOne, StepTwo, StepThree, StepFour, StepFive];
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const schema = StepOne.schema
    .merge(StepTwo.schema)
    .merge(StepThree.schema)
    .merge(StepFour.schema)
    .merge(StepFive.schema);
  type FormResult = z.infer<typeof schema>;

  const navigate = useNavigate();
  const onOnboardingFinish = async (data: FormResult): Promise<void> => {
    await updateUserProfile(data satisfies UserProfileBusinessDetails);
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
          wizardSteps={stepsConfig}
        />
      </div>
    </div>
  );
};

export default Onboarding;
