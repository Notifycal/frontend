import { createFileRoute } from '@tanstack/react-router';

import AppAuthedLayout from '@components/layout/AppAuthedLayout';
import { Faq } from '@pages/Faq';

export const Route = createFileRoute('/_auth/faq')({
  component: () => (
    <AppAuthedLayout>
      <Faq />
    </AppAuthedLayout>
  )
});
