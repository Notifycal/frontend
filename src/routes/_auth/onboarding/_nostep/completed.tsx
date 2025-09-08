import { useOnboardingNavigationStatic } from '@hooks/useOnboardingNavigation';
import { createFileRoute, redirect } from '@tanstack/react-router';

import OnboardingCompleted from '@components/onboarding/OnboardingCompleted';

export const Route = createFileRoute('/_auth/onboarding/_nostep/completed')({
  component: OnboardingCompleted,
  beforeLoad: () => {
    if (useOnboardingNavigationStatic.hasIncompleteSteps()) {
      throw redirect({ to: `/onboarding` });
    }
  }
});
