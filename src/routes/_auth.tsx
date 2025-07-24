import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';

// This route (and all the routes starting with _) is not an actual route
// In fact this defines the layout of all authenticated routes.
export const Route = createFileRoute('/_auth')({
  beforeLoad: ({ context, location }) => {
    console.log('BEGIN /_auth');
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: '/',
        search: {
          redirect: location.href
        }
      });
    }
    console.log('END /_auth');
  },
  component: Outlet
});
