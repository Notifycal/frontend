import { getUserProfile } from '@/api/userProfile';
import type { JSX } from 'react';

import useExtendedTierInfo from '@hooks/useExtendedTierInfo';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { Card } from '@mantine/core';
import UserTierInfo from '@components/ui/UserTierInfo/UserTierInfo';
import CreditBalance from '@components/ui/CreditBalance/CreditBalance';
import ManageBilling from '@components/ui/ManageBilling/ManageBilling';

const Billing = (): JSX.Element => {
  const { t } = useTranslation();
  const { data: user, isError } = useQuery({
    queryKey: ['user-profile'],
    queryFn: getUserProfile
  });

  if (isError || !user?.credits?.tier) {
    throw new Error(t('billing.error.noUserData'));
  }

  const tierInfo = useExtendedTierInfo(user.credits.tier);

  const cardCommonProps = {
    withBorder: true,
    padding: 'lg',
    radius: 'md',
    shadow: 'md'
  };

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <Card {...cardCommonProps}>{tierInfo && <UserTierInfo tierInfo={tierInfo} />}</Card>
      <Card {...cardCommonProps}>
        <CreditBalance
          topupCreditBalance={user?.credits?.topupCreditBalance}
          subscriptionCreditBalance={{
            used: user?.credits?.subscriptionCreditBalance,
            total: tierInfo.credits
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
