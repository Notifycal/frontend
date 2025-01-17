import { getUserProfile } from '@api/userProfile';
import type { FunctionComponent } from '@common/types';
import { useQuery } from '@tanstack/react-query';
import { Navigate, useMatchRoute } from '@tanstack/react-router';
import type { ReactNode } from 'react';

export const UserProvider = ({ children }: { children: ReactNode }): FunctionComponent => {
  const matchRoute = useMatchRoute();

  const { data: user, isLoading } = useQuery({
    queryKey: ['userProfile'],
    queryFn: getUserProfile,
    retry: false,
  });

  if (isLoading) return <div>Loading...</div>

  if (user && user.Status === 'onboarding' && !matchRoute({ to: '/onboarding' })) {
    return <Navigate to="/onboarding"/>
    // return null;
  }

  return <>{ children }</>;
};
