import { getUserProfile } from '@api/userProfile';
import type { FunctionComponent } from '@common/types';
import { useQuery } from '@tanstack/react-query';
import { Navigate, useMatches } from '@tanstack/react-router';
import type { ReactNode } from 'react';

export const UserProvider = ({ children }: { children: ReactNode }): FunctionComponent => {
  const matches = useMatches();

  const { data: user } = useQuery({
    queryKey: ['user-profile'],
    queryFn: getUserProfile,
    retry: false
  });

  const isInOnboardingAlready = matches.some((match) => match.pathname.startsWith('/onboarding'));

  if (user && user.userStatus === 'onboarding' && !isInOnboardingAlready) {
    return <Navigate to="/onboarding" />;
  }

  return <>{children}</>;
};
