import { createFileRoute, redirect } from '@tanstack/react-router';
import AppLayout from '../components/layout/AppLayout';

// This route (and all the routes starting with _) is not an actual route
// In fact this defines the layout of all authenticated routes.
export const Route = createFileRoute('/_auth')({
  beforeLoad: ({ context, location }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: '/',
        search: {
          redirect: location.href
        }
      });
    }
  },
  component: AppLayout
});
