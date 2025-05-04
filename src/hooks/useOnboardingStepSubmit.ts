import { getStepByIndex, type StepKey } from '@constants/onboardingSteps';
import type { OnboardingData } from '@our-types/onboarding';
import { useOnboardingStore } from '@store/useOnboardingStore';
import { useNavigate } from '@tanstack/react-router';

interface StepSubmitHook {
  handleStepSubmit: <K extends StepKey>(formData: OnboardingData[K]) => Promise<void>;
}

export function useStepSubmit(): StepSubmitHook {
  const { setStepData, markStepAsCompleted, currentStep } = useOnboardingStore();
  const navigate = useNavigate();

  const handleStepSubmit = async <K extends StepKey>(formData: OnboardingData[K]): Promise<void> => {
    const step = getStepByIndex(currentStep);

    if (step) {
      const { stepKey } = step;
  
      setStepData(stepKey, formData);
      markStepAsCompleted(stepKey);
  
      const nextStep = getStepByIndex(currentStep + 1);
      if (nextStep) {
        await navigate({ to: `/wizard/$step`, params: { step: nextStep.path } });
      }
    }
  };

  return { handleStepSubmit };
}
