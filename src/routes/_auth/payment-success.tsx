import { getUserProfile } from '@/api/userProfile';
import FullPageOverlaySpinner from '@components/ui/FullPageOverlaySpinner/FullPageOverlaySpinner';
import { useBillingStore } from '@store/useBillingStore';
import { useOnboardingNavigation } from '@hooks/useOnboardingNavigation';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { type JSX, useEffect, useState } from 'react';

function PaymentSuccessRedirect(): JSX.Element {
  const navigate = useNavigate();
  const [shouldPoll, setShouldPoll] = useState(true);
  const { topupCreditBalance, purchaseOperation, reset, previousUserStatus } = useBillingStore();
  const { markStepAsCompleted } = useOnboardingNavigation();

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
          to: '/dashboard',
          search: {
            creditsAdded: true
          }
        });
      }
      // If not increased, polling continues
    } else if (purchaseOperation === 'tierPurchase') {
      markStepAsCompleted('tierSelection');
      stopAndReset();
      if (previousUserStatus === 'cancelled') {
        void navigate({ to: '/dashboard' });
      } else {
        void navigate({ to: '/onboarding/completed' });
      }
    }
  }, [
    navigate,
    isSuccess,
    user,
    topupCreditBalance,
    purchaseOperation,
    reset,
    markStepAsCompleted,
    previousUserStatus
  ]);

  return <FullPageOverlaySpinner />;
}

export const Route = createFileRoute('/_auth/payment-success')({
  component: PaymentSuccessRedirect
});
