import { getFirstIncompleteStepIndex, getStepByIndex } from '@constants/onboardingSteps';
import { useOnboardingStore } from '@store/useOnboardingStore';
import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_auth/wizard/')({
  beforeLoad: () => {
    const { completedSteps } = useOnboardingStore.getState();
    
    // if (!hasIncompleteSteps(completedSteps)) {
    //   throw redirect({ to: `/wizard/completed` });
    // }
    
    const firstIncompleteIndex = getFirstIncompleteStepIndex(completedSteps) || 0;
    const path = getStepByIndex(firstIncompleteIndex)?.path || '';
    throw redirect({ to: '/wizard/$step', params: { step: path } });
  }
});
