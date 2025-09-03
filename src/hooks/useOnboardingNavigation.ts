import { getStepByIndex } from '@constants/onboardingSteps';
import type { UserStatus } from '@notifycal/shared/types';
import { useOnboardingStore } from '@store/useOnboardingStore';
import { useNavigate } from '@tanstack/react-router';

interface OnboardingNavigationHook {
  handleBackNavigation: () => Promise<void>;
  handleForwardNavigation: (userStatus?: UserStatus) => Promise<void>;
  canGoBack: boolean;
}

export function useOnboardingNavigation(): OnboardingNavigationHook {
  const { currentStep } = useOnboardingStore();
  const navigate = useNavigate();

  const handleBackNavigation = async (): Promise<void> => {
    if (currentStep > 0) {
      const previousStep = getStepByIndex(currentStep - 1);
      if (previousStep) {
        await navigate({ to: '/onboarding/$step', params: { step: previousStep.path } });
      }
    }
  };

  const handleForwardNavigation = async (userStatus?: UserStatus): Promise<void> => {
    if (userStatus && userStatus !== 'demo') {
      await navigate({ to: '/dashboard' });
      return;
    }
    const nextStep = getStepByIndex(currentStep + 1);
    if (nextStep) {
      await navigate({ to: `/onboarding/$step`, params: { step: nextStep.path } });
    } else {
      await navigate({ to: '/onboarding/completed' });
    }
  };

  const canGoBack = currentStep > 0;

  return { handleBackNavigation, handleForwardNavigation, canGoBack };
}
