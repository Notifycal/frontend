import { Feedback } from '@components/ui/Feedback/Feedback';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_auth/onboarding/_nostep/feedback')({
  component: Feedback
});
