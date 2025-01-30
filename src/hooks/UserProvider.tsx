import { getUserProfile } from '@api/userProfile';
import type { FunctionComponent } from '@common/types';
import FullPageSpinner from '@components/ui/FullPageSpinner/FullPageSpinner';
import { useQuery } from '@tanstack/react-query';
import { Navigate, useMatchRoute } from '@tanstack/react-router';
import type { ReactNode } from 'react';

export const UserProvider = ({ children }: { children: ReactNode }): FunctionComponent => {
  const matchRoute = useMatchRoute();

  const { data: user, isLoading } = useQuery({
    queryKey: ['user-profile'],
    queryFn: getUserProfile,
    retry: false
  });

  if (isLoading) return <FullPageSpinner />;

  if (user && user.userStatus === 'onboarding' && !matchRoute({ to: '/onboarding' })) {
    return <Navigate to="/onboarding" />;
  }

  return <>{children}</>;
};
