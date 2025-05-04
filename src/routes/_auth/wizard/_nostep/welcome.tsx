import OnboardingWelcome from '@components/ui/onboarding/OnboardingWelcome';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_auth/wizard/_nostep/welcome')({
  component: OnboardingWelcome
});
