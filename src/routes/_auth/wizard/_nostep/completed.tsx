import { useOnboardingStore } from '@store/useOnboardingStore';

import { hasIncompleteSteps } from '@constants/onboardingSteps';
import { createFileRoute, redirect } from '@tanstack/react-router';

import OnboardingCompleted from '@components/ui/onboarding/OnboardingCompleted';

export const Route = createFileRoute('/_auth/wizard/_nostep/completed')({
  component: OnboardingCompleted,
  beforeLoad: () => {
    const { completedSteps } = useOnboardingStore.getState();

    if (hasIncompleteSteps(completedSteps)) {
      throw redirect({ to: `/wizard` });
    }
  }
});
