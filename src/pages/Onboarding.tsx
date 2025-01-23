import Wizard from '@components/ui/Wizard/Wizard';

import { StepFive } from '@components/ui/Wizard/StepFive';
import { StepFour } from '@components/ui/Wizard/StepFour';
import { StepOne } from '@components/ui/Wizard/StepOne';
import { StepThree } from '@components/ui/Wizard/StepThree';
import { StepTwo } from '@components/ui/Wizard/StepTwo';

import { useNavigate } from '@tanstack/react-router';

 
import { type UserProfileBusinessDetails, updateUserProfile } from '@api/userProfile';

import onboardingImg from '@assets/images/onboarding.png';

import type { FunctionComponent } from '@common/types';
import type { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { type UseFormReturn, useForm } from 'react-hook-form';

const Onboarding = (): FunctionComponent => {
  const steps = [StepOne, StepTwo, StepThree, StepFour, StepFive];
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const schema = StepTwo.schema.merge(StepThree.schema).merge(StepFour.schema) satisfies z.ZodType<UserProfileBusinessDetails>;
  type FormResult = z.infer<typeof schema>

  const defaultValues = steps.map(s => s.defaultValues).reduce((accumulator, item) => ({
    ...accumulator,
    ...item
  }));
  const navigate = useNavigate();

  const onOnboardingFinish = async (data: FormResult): Promise<void> => {
    await updateUserProfile(data);
    await navigate({ to: '/dashboard' });
  };

  function useFormFn<TSchema extends z.AnyZodObject>(schema: TSchema): UseFormReturn<FormResult> {
    return useForm<FormResult>({
      resolver: zodResolver(schema),
      defaultValues,
      mode: 'onTouched',
      shouldUnregister: false
    });
  }
  
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
          useFormFn={useFormFn}
          wizardSteps={steps}
        />
      </div>
    </div>
  );
};

export default Onboarding;
