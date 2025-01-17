import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';

import { UserProvider } from '@hooks/UserProvider';

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
  component: () => (
    <UserProvider>
      <Outlet />
    </UserProvider>      
  )
});
