import OnboardingLayout from '@components/layout/onboarding/OnboardingLayout';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_auth/onboarding')({
  component: OnboardingLayout
});
