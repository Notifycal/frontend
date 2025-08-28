import type { IdpName, User, UserStatus } from '@notifycal/shared/types';
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';

import AppAuthedLayout from '@components/layout/AppAuthedLayout';

type RedirectMap = Partial<Record<UserStatus, string>>;

const softRedirects = {
  cancelled: '/dashboard',
  'out-of-credits': '/dashboard',
  unpaid: '/dashboard'
} satisfies RedirectMap;

const hardRedirects = {
  banned: '/account-locked',
  demo: '/onboarding/try-it-out',
  onboarding: '/onboarding'
} satisfies RedirectMap;

const doRedirect = (userStatus: UserStatus, redirectMap: RedirectMap, currentPath: string): void => {
  const redirectTarget = redirectMap[userStatus];
  // this not only avoids de double redirect if in the same path, but if the user has some
  // query/hash parameters, it also preserves them: same path, but not necessarily the same full URL.
  if (redirectTarget && redirectTarget !== currentPath) {
    throw redirect({
      to: redirectTarget
    });
  }
};

export const Route = createFileRoute('/_auth/_app')({
  beforeLoad: ({ context, location }) => {
    const user = context.queryClient.getQueryData<User<IdpName>>(['user-profile']);

    if (user?.userStatus) {
      doRedirect(user.userStatus, hardRedirects, location.pathname);

      if (context.auth.shouldHandlePostLoginFlow) {
        context.auth.setShouldHandlePostLoginFlow(false);
        doRedirect(user?.userStatus, softRedirects, location.pathname);
      }
    }
  },
  component: () => (
    <AppAuthedLayout>
      <Outlet />
    </AppAuthedLayout>
  )
});
