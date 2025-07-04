import { getStepByIndex, type StepKey } from '@constants/onboardingSteps';
import type { OnboardingData } from '@our-types/onboarding';
import { useOnboardingStore } from '@store/useOnboardingStore';
import { useOnboardingNavigation } from './useOnboardingNavigation';

interface StepSubmitHook {
  handleStepSubmit: <K extends StepKey>(formData: OnboardingData[K]) => Promise<void>;
  handleStepData: <K extends StepKey>(formData: OnboardingData[K]) => void;
}

export function useStepSubmit(): StepSubmitHook {
  const { setStepData, markStepAsCompleted, currentStep } = useOnboardingStore();
  const { handleForwardNavigation } = useOnboardingNavigation();

  const handleStepData = <K extends StepKey>(formData: OnboardingData[K]): void => {
    const step = getStepByIndex(currentStep);

    if (step) {
      const { stepKey } = step;

      setStepData(stepKey, formData);
      markStepAsCompleted(stepKey);
    }
  };

  const handleStepSubmit = async <K extends StepKey>(formData: OnboardingData[K]): Promise<void> => {
    handleStepData(formData);
    await handleForwardNavigation();
  };

  return { handleStepSubmit, handleStepData };
}
