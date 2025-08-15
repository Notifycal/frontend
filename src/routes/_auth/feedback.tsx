import { createFileRoute } from '@tanstack/react-router';

import AppAuthedLayout from '@components/layout/AppLayout';
import { Feedback } from '@pages/Feedback';

export const Route = createFileRoute('/_auth/feedback')({
  component: () => (
    <AppAuthedLayout>
      <Feedback />
    </AppAuthedLayout>
  )
});
