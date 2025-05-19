import { getStepByIndex, type StepKey } from '@constants/onboardingSteps';
import type { OnboardingData } from '@our-types/onboarding';
import { useOnboardingStore } from '@store/useOnboardingStore';
import { useNavigate } from '@tanstack/react-router';

interface StepSubmitHook {
  handleStepSubmit: <K extends StepKey>(formData: OnboardingData[K]) => Promise<void>;
  handleStepData: <K extends StepKey>(formData: OnboardingData[K]) => void;
  handleStepNavigation: () => Promise<void>;
}

export function useStepSubmit(): StepSubmitHook {
  const { setStepData, markStepAsCompleted, currentStep } = useOnboardingStore();
  const navigate = useNavigate();

  const handleStepData = <K extends StepKey>(formData: OnboardingData[K]): void => {
    const step = getStepByIndex(currentStep);

    if (step) {
      const { stepKey } = step;

      setStepData(stepKey, formData);
      markStepAsCompleted(stepKey);
    }
  };

  const handleStepNavigation = async (): Promise<void> => {
    const nextStep = getStepByIndex(currentStep + 1);
    if (nextStep) {
      await navigate({ to: `/onboarding/$step`, params: { step: nextStep.path } });
    } else {
      await navigate({ to: '/onboarding/completed' });
    }
  };

  const handleStepSubmit = async <K extends StepKey>(formData: OnboardingData[K]): Promise<void> => {
    handleStepData(formData);
    await handleStepNavigation();
  };

  return { handleStepSubmit, handleStepData, handleStepNavigation };
}
