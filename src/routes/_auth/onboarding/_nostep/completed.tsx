import { useOnboardingNavigationStatic } from '@hooks/useOnboardingNavigation';
import { createFileRoute, redirect } from '@tanstack/react-router';

import OnboardingCompleted from '@components/onboarding/OnboardingCompleted';

export const Route = createFileRoute('/_auth/onboarding/_nostep/completed')({
  component: OnboardingCompleted,
  beforeLoad: () => {
    const validation = useOnboardingNavigationStatic.validateCompletedAccess();
    if (!validation.isValid) {
      throw redirect({ to: `/onboarding` });
    }
  }
});
