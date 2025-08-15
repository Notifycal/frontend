import { PrivacyPolicy } from '@pages/PrivacyPolicy';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/privacy-policy')({
  component: PrivacyPolicy
});
