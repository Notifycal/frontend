import type { User, IdpName, UserStatus } from '@notifycal/shared/types';
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { UserProfileProvider } from '@providers/UserProfileProvider';

import AppLayout from '@components/layout/AppLayout';

type RedirectMap = Partial<Record<UserStatus, string>>;

const softRedirects = {
  cancelled: '/dashboard/billing',
  'out-of-credits': '/dashboard/billing',
  unpaid: '/dashboard/billing'
} satisfies RedirectMap;

const hardRedirects = {
  banned: '/account-locked',
  demo: '/onboarding/try-it-out',
  onboarding: '/onboarding'
} satisfies RedirectMap;

const doRedirect = (userStatus: UserStatus, redirectMap: RedirectMap): void => {
  const redirectTarget = redirectMap[userStatus];
  if (redirectTarget) {
    throw redirect({
      to: redirectTarget
    });
  }
};

export const Route = createFileRoute('/_auth/_app')({
  beforeLoad: ({ context }) => {
    const user = context.queryClient.getQueryData<User<IdpName>>(['user-profile']);

    if (user?.userStatus) {
      doRedirect(user.userStatus, hardRedirects);

      if (context.auth.hasJustLoggedIn) {
        doRedirect(user?.userStatus, softRedirects);
      }
    }
  },
  component: () => (
    <UserProfileProvider>
      <AppLayout>
        <Outlet />
      </AppLayout>
    </UserProfileProvider>
  )
});
