import { PaymentSuccess } from '@pages/PaymentSuccess';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_auth/_app/payment-success')({
  component: PaymentSuccess
});
