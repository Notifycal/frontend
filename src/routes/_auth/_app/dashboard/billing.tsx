import Billing from '@pages/Billing';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_auth/_app/dashboard/billing')({
  component: Billing
});
