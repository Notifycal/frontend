import { createFileRoute } from '@tanstack/react-router';

import { Feedback } from '@pages/Feedback';
import AppLayout from '@components/layout/AppLayout';

export const Route = createFileRoute('/_auth/feedback')({
  component: () => (
    <AppLayout>
      <Feedback />
    </AppLayout>
  )
});
