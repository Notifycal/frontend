import { getUserProfile } from '@api/userProfile';
import type { FunctionComponent } from '@common/types';
import FullPageSpinner from '@components/ui/FullPageSpinner/FullPageSpinner';
import type { UserStatus } from '@notifycal/shared/types';
import { useQuery } from '@tanstack/react-query';
import { Navigate, useMatches } from '@tanstack/react-router';
import type { ReactNode } from 'react';

const userStatuses: Record<UserStatus, string> = {
  onboarding: '/onboarding',
  demo: '/onboarding/try-it-out',
  live: '/dashboard',
  "out-of-credits": '/dashboard/billing',
  unpaid: '/dashboard/billing',
  cancelled: '/dashboard/billing',
  banned: '/banned'
};

export const UserProvider = ({ children }: { children: ReactNode }): FunctionComponent => {
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
    if (!isThereAlready(goToRoute)) {
      return <Navigate to={goToRoute} />
    }
  }

  return <>{children}</>;
};
