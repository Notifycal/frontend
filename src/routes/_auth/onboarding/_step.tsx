import StepLayout from '@components/layout/onboarding/StepLayout';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_auth/onboarding/_step')({
  component: StepLayout
});
