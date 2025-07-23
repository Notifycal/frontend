import type { JSX, ReactNode } from 'react';
import type { UserStatus } from '@notifycal/shared/types';
import { getUserProfile } from '@api/userProfile';

import { useQuery } from '@tanstack/react-query';
import { Navigate, useMatches } from '@tanstack/react-router';

import FullPageSpinner from '@components/ui/FullPageSpinner/FullPageSpinner';

const userStatuses: Record<UserStatus, string | undefined> = {
  onboarding: '/onboarding',
  'out-of-credits': '/dashboard/billing',
  unpaid: '/dashboard/billing',
  cancelled: '/dashboard/billing',
  demo: '/onboarding/try-it-out',
  live: undefined,
  banned: undefined
};

export const UserProvider = ({ children }: { children: ReactNode }): JSX.Element => {
  const matches = useMatches();

  const { data: user, isLoading } = useQuery({
    queryKey: ['user-profile'],
    queryFn: getUserProfile,
    retry: false
  });

  if (isLoading) return <FullPageSpinner />;

  const isThereAlready = (path: string): boolean => matches.some((match) => match.pathname.startsWith(path));

  if (user) {
    const goToRoute = userStatuses[user.userStatus];
    if (goToRoute && !isThereAlready(goToRoute)) {
      return <Navigate to={goToRoute} />;
    }
  }

  return <>{children}</>;
};
