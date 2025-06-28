import Test from '@pages/Test';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_auth/pricing')({
  component: Test
});
