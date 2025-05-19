import NoStepLayout from '@components/layout/onboarding/NoStepLayout';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_auth/onboarding/_nostep')({
  component: NoStepLayout
});
