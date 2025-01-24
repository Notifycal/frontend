import { StepFive } from '@components/ui/Wizard/StepFive';
import { StepFour } from '@components/ui/Wizard/StepFour';
import { StepOne } from '@components/ui/Wizard/StepOne';
import { StepThree } from '@components/ui/Wizard/StepThree';
import { StepTwo } from '@components/ui/Wizard/StepTwo';
import Wizard from '@components/ui/Wizard/Wizard';

import { updateUserProfile, UserProfileBusinessDetailsSchema } from '@api/userProfile';
import { useNavigate } from '@tanstack/react-router';

import onboardingImg from '@assets/images/onboarding.png';

import type { FunctionComponent } from '@common/types';
import { useErrorBoundary } from 'react-error-boundary';
import { z } from 'zod';

const Onboarding = (): FunctionComponent => {
  const stepsConfig = [StepOne, StepTwo, StepThree, StepFour, StepFive];
  const steps = Object.values(stepsConfig).map((s) => s.schema);
  const initialValue: z.AnyZodObject = z.object({});
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const schema = steps.reduce((accumulator, item) => accumulator.merge(item), initialValue);
  type FormResult = z.infer<typeof schema>;

  const navigate = useNavigate();

  const { showBoundary } = useErrorBoundary();

  const onOnboardingFinish = async (data: FormResult): Promise<void> => {
    const parsingResult = UserProfileBusinessDetailsSchema.safeParse(data);
    if (parsingResult.success) {
      await updateUserProfile(parsingResult.data);
      await navigate({ to: '/dashboard' });
    } else {
      showBoundary(new Error('This should not happen'));
    }
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
