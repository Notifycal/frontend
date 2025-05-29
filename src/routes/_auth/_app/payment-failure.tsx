import { PaymentFailure } from '@pages/PaymentFailure';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_auth/_app/payment-failure')({
  component: PaymentFailure
});
