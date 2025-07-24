import { getUserProfile } from '@api/userProfile';
import AppLayout from '@components/layout/AppLayout';
import type { UserStatus } from '@notifycal/shared/types';
import { createFileRoute, redirect } from '@tanstack/react-router';

type RedirectConfig = {
  forcedRedirect?: string;
  allowedRoutes?: Array<string>;
};

const userStatusRedirects: Record<UserStatus, RedirectConfig> = {
  onboarding: {
    forcedRedirect: '/onboarding',
    allowedRoutes: ['/onboarding']
  },
  'out-of-credits': {
    forcedRedirect: '/billing'
  },
  unpaid: {
    forcedRedirect: '/billing'
  },
  cancelled: {
    forcedRedirect: '/billing'
  },
  demo: {
    forcedRedirect: '/onboarding/try-it-out',
    allowedRoutes: ['/onboarding/try-it-out']
  },
  live: {},
  banned: {}
};

export const Route = createFileRoute('/_auth/_app')({
  loader: async ({ context, location }) => {
    const user = await context.queryClient.fetchQuery({
      queryKey: ['user-profile'],
      queryFn: getUserProfile
    });
    const redirectConfig = userStatusRedirects[user.userStatus];
    const { forcedRedirect, allowedRoutes } = redirectConfig;
    if (forcedRedirect) {
      if (allowedRoutes) {
        const isAllowedRoute = allowedRoutes.some((route) => location.pathname.startsWith(route));
        if (!isAllowedRoute) {
          throw redirect({ to: forcedRedirect });
        }
      } else {
        throw redirect({ to: forcedRedirect });
      }
    }

    return { user };
  },
  component: AppLayout
});
