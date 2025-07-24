import { createRootRouteWithContext, Outlet, redirect } from '@tanstack/react-router';

import type { AuthContext } from '@hooks/AuthProvider';
import type { UserStatus } from '@notifycal/shared/types';

interface MyRouterContext {
  auth: AuthContext;
}

const userStatusRedirects: Record<UserStatus, string | undefined> = {
  onboarding: '/onboarding',
  'out-of-credits': '/dashboard/billing',
  unpaid: '/dashboard/billing',
  cancelled: '/dashboard/billing',
  demo: '/onboarding/try-it-out',
  live: undefined,
  banned: undefined
};

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: Outlet,
  beforeLoad: ({ context, location }) => {
    const userStatus = context.auth.authInfo?.userStatus;
    console.log('WTF?', userStatus);
    if (userStatus) {
      const redirectTo = userStatusRedirects[userStatus];
      console.log('outside if', userStatus, redirectTo, location.pathname);
      if (redirectTo && !location.pathname.startsWith(redirectTo)) {
        console.log('inside if', userStatus, redirectTo, location.pathname);
        throw redirect({ to: redirectTo });
      }
    }
    console.log('END /__root');
  }
});
