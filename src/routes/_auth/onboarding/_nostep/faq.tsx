import { Faq } from '@components/ui/Faq/Faq';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_auth/onboarding/_nostep/faq')({
  component: Faq
});
