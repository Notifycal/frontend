import { getFirstIncompleteStepIndex, getStepByIndex } from '@constants/onboardingSteps';
import { useOnboardingStore } from '@store/useOnboardingStore';
import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_auth/onboarding/')({
  beforeLoad: () => {
    const { completedSteps } = useOnboardingStore.getState();
    
    // if (!hasIncompleteSteps(completedSteps)) {
    //   throw redirect({ to: `/onboarding/completed` });
    // }
    
    const firstIncompleteIndex = getFirstIncompleteStepIndex(completedSteps) || 0;
    const path = getStepByIndex(firstIncompleteIndex)?.path || '';
    throw redirect({ to: '/onboarding/$step', params: { step: path } });
  }
});
