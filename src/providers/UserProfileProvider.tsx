import { createContext, useContext, type JSX } from 'react';
import type { User, IdpName } from '@notifycal/shared/types';
import { getUserProfile } from '@api/userProfile';

import { useQuery } from '@tanstack/react-query';

import FullPageSpinner from '@components/ui/FullPageSpinner/FullPageSpinner';

export const UserProfileContext = createContext<User<IdpName> | null>(null);

export const UserProfileProvider = ({ children }: { children: React.ReactNode }): JSX.Element => {
  const { data: user, isLoading } = useQuery({
    queryKey: ['user-profile'],
    queryFn: getUserProfile,
    retry: false
  });

  if (isLoading) return <FullPageSpinner />;

  return <UserProfileContext.Provider value={user ?? null}>{children}</UserProfileContext.Provider>;
};

export const useUserProfile = (): User<IdpName> => {
  const context = useContext(UserProfileContext);
  if (!context) {
    throw new Error('useUserProfile must be used within a UserProfileProvider');
  }
  return context;
};
