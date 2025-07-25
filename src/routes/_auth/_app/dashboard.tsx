import Dashboard from '@pages/Dashboard';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_auth/_app/dashboard')({
  component: Dashboard,
  staticData: {
    layout: {
      useFancyHeader: true,
      fancyHeaderTitle: 'Dashboard'
    }
  }
});
