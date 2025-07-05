import { useQuery } from '@tanstack/react-query';
import { getUserProfile } from '@/api/userProfile';

import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { type JSX, useEffect, useState } from 'react';

import FullPageSpinner from '@components/ui/FullPageSpinner/FullPageSpinner';

function PaymentSuccessRedirect(): JSX.Element {
  const navigate = useNavigate();
  const [shouldPoll, setShouldPoll] = useState(true);

  const userProfileQuery = useQuery({
    queryKey: ['user-profile'],
    queryFn: getUserProfile,
    enabled: true, // Only fetch if polling is enabled
    refetchInterval: shouldPoll ? 2000 : false, // Poll every 2 seconds if enabled
    gcTime: 0, // Data is immediately garbage collected after it's no longer used
  });

  useEffect(() => {
    if (userProfileQuery.isSuccess) {
      const hasTier = userProfileQuery.data.credits?.tier;

      if (hasTier) {
        setShouldPoll(false); // Stop polling
        void navigate({ to: '/onboarding/completed' });
      }
    }
  }, [navigate, userProfileQuery.isSuccess, userProfileQuery.data]);

  return <FullPageSpinner />;
}

export const Route = createFileRoute('/_auth/payment-success')({
  component: PaymentSuccessRedirect
});
