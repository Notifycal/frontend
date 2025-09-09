import OnboardingWelcome from '@components/onboarding/OnboardingWelcome';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_auth/onboarding/_nostep/welcome')({
  component: OnboardingWelcome,
  staticData: {
    layout: {
      narrowContainer: true
    }
  }
});
