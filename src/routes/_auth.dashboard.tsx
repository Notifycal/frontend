import { createFileRoute } from '@tanstack/react-router';

import AppLayout from '@components/layout/AppLayout';
import { Dashboard } from '@pages/Dashboard';

export const Route = createFileRoute('/_auth/dashboard')({
  component: () => (
    <AppLayout>
      <Dashboard />
    </AppLayout>
  ),
  staticData: {
    layout: {
      useFancyHeader: true,
      fancyHeaderTitle: 'Dashboard'
    }
  }
});
