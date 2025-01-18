import Wizard, { type WizardConfig } from '@components/ui/Wizard/Wizard';

import { StepFive } from '@components/ui/Wizard/StepFive';
import { StepFour } from '@components/ui/Wizard/StepFour';
import { StepOne } from '@components/ui/Wizard/StepOne';
import { StepThree } from '@components/ui/Wizard/StepThree';
import { StepTwo } from '@components/ui/Wizard/StepTwo';

import type { FunctionComponent } from '@common/types';

import onboardingImg from '@assets/images/onboarding.png';

const Onboarding = (): FunctionComponent => {
  const onboardingConfig: WizardConfig<Record<string, unknown>> = [StepOne, StepTwo, StepThree, StepFour, StepFive];

  return (
    <div className="sm:mx-auto sm:w-full sm:max-w-[1000px] bg-white shadow-md sm:rounded-lg min-h-1/2 max-h-1/2 h-[500px]">
      <div className="flex flex-col md:flex-row items-stretch justify-center h-full">
        <div className="w-full md:w-1/2 flex border-r border-gray-400-600">
          <img
            alt="Onboarding illustration"
            className="w-full h-full max-w-sm md:max-w-full object-cover"
            src={onboardingImg}
          />
        </div>
        <Wizard
          header="Bienvenid@ a Notifycal"
          wizardSteps={onboardingConfig}
          handleFinish={async (data) => {
            console.log('Form data:', data);
          }}
          handleNext={() => {
            console.log('next');
          }}
          handlePrevious={() => {
            console.log('previous');
          }}
        />
      </div>
    </div>
  );
};

export default Onboarding;
