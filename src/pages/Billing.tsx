import { getUserProfile } from '@/api/userProfile';
import { useState, type JSX } from 'react';

import useExtendedTierInfo from '@hooks/useExtendedTierInfo';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { Card } from '@mantine/core';
import UserTierInfo from '@components/ui/UserTierInfo/UserTierInfo';
import CreditBalance from '@components/ui/CreditBalance/CreditBalance';
import ManageBilling from '@components/ui/ManageBilling/ManageBilling';
import FlatError from '@components/ui/FlatError/FlatError';

const Billing = (): JSX.Element => {
  const { t } = useTranslation();
  const { data: user, isError } = useQuery({
    queryKey: ['user-profile'],
    queryFn: getUserProfile
  });

  const [error, setError] = useState<string | null>(null);

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
      {error && (
        <div className="lg:col-span-2">
          <FlatError
            onErrorClose={() => {
              setError(null);
            }}
          >
            {error}
          </FlatError>
        </div>
      )}
      <Card {...cardCommonProps}>{tierInfo && <UserTierInfo tierInfo={tierInfo} />}</Card>
      <Card {...cardCommonProps}>
        <CreditBalance
          topupCreditBalance={user?.credits?.topupCreditBalance}
          subscriptionCreditBalance={{
            used: user?.credits?.subscriptionCreditBalance,
            total: tierInfo.credits
          }}
          onError={setError}
        />
      </Card>
      <Card {...cardCommonProps} className="lg:col-span-2">
        <ManageBilling onError={setError} />
      </Card>
    </div>
  );
};

export default Billing;
