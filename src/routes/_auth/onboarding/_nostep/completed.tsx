import { useOnboardingStore } from '@store/useOnboardingStore';

import { hasIncompleteSteps } from '@constants/onboardingSteps';
import { createFileRoute, redirect } from '@tanstack/react-router';

import OnboardingCompleted from '@components/onboarding/OnboardingCompleted';

export const Route = createFileRoute('/_auth/onboarding/_nostep/completed')({
  component: OnboardingCompleted,
  beforeLoad: () => {
    const { completedSteps } = useOnboardingStore.getState();

    if (hasIncompleteSteps(completedSteps)) {
      throw redirect({ to: `/onboarding` });
    }
  }
});
