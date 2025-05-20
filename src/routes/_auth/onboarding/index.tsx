import { getFirstIncompleteStepIndex, getStepByIndex } from '@constants/onboardingSteps';
import { useOnboardingStore } from '@store/useOnboardingStore';
import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_auth/onboarding/')({
  beforeLoad: () => {
    const { completedSteps } = useOnboardingStore.getState();

    const firstIncompleteIndex = getFirstIncompleteStepIndex(completedSteps) || 0;
    if (firstIncompleteIndex === 0) {
      throw redirect({ to: '/onboarding/welcome' });
    }
    const path = getStepByIndex(firstIncompleteIndex)?.path || '';
    throw redirect({ to: '/onboarding/$step', params: { step: path } });
  }
});
