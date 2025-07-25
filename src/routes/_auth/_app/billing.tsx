import Billing from '@pages/Billing';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_auth/_app/billing')({
  component: Billing
});
