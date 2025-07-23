import { getUserProfile } from '@/api/userProfile';

import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { type JSX, useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useBillingStore } from '@store/useBillingStore';

import FullPageSpinner from '@components/ui/FullPageSpinner/FullPageSpinner';
import { useOnboardingStore } from '@store/useOnboardingStore';

function PaymentSuccessRedirect(): JSX.Element {
  const navigate = useNavigate();
  const [shouldPoll, setShouldPoll] = useState(true);
  const { topupCreditBalance, purchaseOperation, reset } = useBillingStore();
  const { markStepAsCompleted } = useOnboardingStore();

  const { data: user, isSuccess } = useQuery({
    queryKey: ['user-profile'],
    queryFn: getUserProfile,
    enabled: true, // Only fetch if polling is enabled
    refetchInterval: shouldPoll ? 2000 : false, // Poll every 2 seconds if enabled
    gcTime: 0 // Data is immediately garbage collected after it's no longer used
  });

  const isTopupCreditIncrease = (oldCredits: number, newCredits: number): boolean => newCredits > oldCredits;

  useEffect(() => {
    const stopAndReset = (): void => {
      setShouldPoll(false);
      reset();
    };

    if (!isSuccess || !user.credits) {
      return;
    }

    if (purchaseOperation === 'topupPurchase') {
      if (isTopupCreditIncrease(topupCreditBalance, user.credits.topupCreditBalance)) {
        stopAndReset();
        void navigate({
          to: '/dashboard/billing',
          search: {
            creditsAdded: true
          }
        });
      }
      // If not increased, polling continues
    } else if (purchaseOperation === 'tierPurchase') {
      markStepAsCompleted('tierSelection');
      stopAndReset();
      void navigate({ to: '/onboarding/completed' });
    }
  }, [navigate, isSuccess, user, topupCreditBalance, purchaseOperation, reset, markStepAsCompleted]);

  return <FullPageSpinner />;
}

export const Route = createFileRoute('/_auth/payment-success')({
  component: PaymentSuccessRedirect
});
