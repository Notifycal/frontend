import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { getUserProfile } from '@api/userProfile';
import type { IdpName, User } from '@notifycal/shared/types';

// This route (and all the routes starting with _) is not an actual route
// In fact this defines the layout of all authenticated routes.
export const Route = createFileRoute('/_auth')({
  beforeLoad: async ({ context, location }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: '/',
        search: {
          redirect: location.href
        }
      });
    }

    const user = await context.queryClient.ensureQueryData({
      queryKey: ['user-profile'],
      queryFn: getUserProfile
    });

    if (!user) {
      throw redirect({
        to: '/',
        search: {
          redirect: location.href
        }
      });
    }
  },
  loader: ({ context }) => {
    // https://github.com/TanStack/query/issues/6198
    const user = context.queryClient.getQueryData<User<IdpName>>(['user-profile']);
    return { user };
  },
  component: Outlet
});
