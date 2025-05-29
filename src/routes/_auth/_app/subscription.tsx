import { Subscription } from '@pages/Subscription';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_auth/_app/subscription')({
  component: Subscription
});
