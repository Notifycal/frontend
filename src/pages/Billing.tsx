import { getUserProfile } from '@/api/userProfile';
import { capitalize } from 'radashi';
import type { JSX } from 'react';

import useExtendedTierInfo from '@hooks/useExtendedTierInfo';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { IconCircleCheckFilled } from '@tabler/icons-react';
import { Alert, Card, Divider, Skeleton, Title } from '@mantine/core';
import ManageBilling from '@components/ui/ManageBilling/ManageBilling';
import CreditBalance from '@components/ui/CreditBalance/CreditBalance';
import TierFeatures from '@components/ui/TierFeatures/TierFeatures';

const Billing = (): JSX.Element => {
  const { t } = useTranslation('onboarding');
  const {
    data: user,
    isLoading,
    isError
  } = useQuery({
    queryKey: ['user-profile'],
    queryFn: getUserProfile
  });

  const cardCommonProps = {
    withBorder: true,
    padding: 'lg',
    radius: 'md',
    shadow: 'md'
  };

  // Call useExtendedTierInfo unconditionally. It handles undefined tierId by returning undefined.
  const tierInfo = useExtendedTierInfo(user?.credits?.tier);
  const TierIcon = tierInfo?.icon; // Access icon conditionally

  // Handle error state
  if (isError) {
    throw new Error('Error loading user data. Please try again.');
  }

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <Card {...cardCommonProps}>
        <>
          {isLoading || !tierInfo ? (
            <>
              <Skeleton height={30} mb="md" width="60%" />
              <Skeleton height={20} mb="md" width="80%" />
            </>
          ) : (
            <>
              <Title className="flex items-center gap-2" order={1}>
                {TierIcon && <TierIcon className="inline w-[1em] h-[1em] text-amber-400" />}
                {tierInfo.displayName}
              </Title>
              <div>
                You are currently in the <span className="font-bold">{tierInfo.displayName}</span> plan.
              </div>
            </>
          )}
          <Divider my="md" />

          <div>Your plan includes:</div>
          {isLoading || !tierInfo ? (
            <>
              <Skeleton height={15} mb="xs" width="90%" />
              <Skeleton height={15} mb="xs" width="85%" />
              <Skeleton height={15} mb="xs" width="70%" />
            </>
          ) : (
            <TierFeatures icon={IconCircleCheckFilled} tier={tierInfo} />
          )}
          <Divider my="md" />
          <Alert
            title={capitalize(t('generic.remember', { ns: 'translations' }))}
            classNames={{
              title: 'text-sm',
              message: 'text-xs'
            }}
          >
            {t('tierSelection.disclaimer')}
          </Alert>
        </>
      </Card>

      <Card {...cardCommonProps}>
        <CreditBalance
          isLoading={isLoading || !user?.credits || !tierInfo} // Pass isLoading to CreditBalance
          topupCreditBalance={user?.credits?.topupCreditBalance}
          subscriptionCreditBalance={{
            used: user?.credits?.subscriptionCreditBalance,
            total: tierInfo?.credits // tierInfo might be undefined here if isLoading is true
          }}
        />
      </Card>
      <Card {...cardCommonProps} className="lg:col-span-2">
        <ManageBilling />
      </Card>
    </div>
  );
};

export default Billing;
