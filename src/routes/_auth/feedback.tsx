import { createFileRoute } from '@tanstack/react-router';

import AppLayout from '@components/layout/AppLayout';
import { Feedback } from '@pages/Feedback';

export const Route = createFileRoute('/_auth/feedback')({
  component: () => (
    <AppLayout>
      <Feedback />
    </AppLayout>
  )
});
