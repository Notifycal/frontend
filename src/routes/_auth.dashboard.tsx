import { createFileRoute } from '@tanstack/react-router';
import { Dashboard } from '../pages/Dashboard';

export const Route = createFileRoute('/_auth/dashboard')({
  component: Dashboard,
  staticData: {
    layout: {
      useFancyHeader: true,
      fancyHeaderTitle: 'Dashboard'
    }
  }
});
