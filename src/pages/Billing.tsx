import { useState, type JSX } from 'react';

import { Route } from '@routes/_auth/_app/billing';

import TierSelectionWrapper from '@components/onboarding/TierSelectionWrapper';
import CreditBalance from '@components/ui/CreditBalance/CreditBalance';
import FlatError from '@components/ui/FlatError/FlatError';
import ManageBilling from '@components/ui/ManageBilling/ManageBilling';
import UserTierInfo from '@components/ui/UserTierInfo/UserTierInfo';
import { Card } from '@mantine/core';
import type { UserStatus } from '@notifycal/shared/types';
import { extendTierInfo } from '@services/tier';
import { useTranslation } from 'react-i18next';

const Billing = (): JSX.Element => {
  const { user } = Route.useLoaderData();

  const [error, setError] = useState<string | null>(null);

  const { t } = useTranslation('onboarding');
  const tierInfo = user.credits?.tier ? extendTierInfo(user.credits?.tier, t) : undefined;

  const cardCommonProps = {
    withBorder: true,
    padding: 'lg',
    radius: 'md',
    shadow: 'md'
  };

  const displayTierSelection: Array<UserStatus> = ['cancelled'];

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

      {tierInfo && user?.credits && !displayTierSelection.some((status) => status === user.userStatus) ? (
        <>
          <Card {...cardCommonProps}>
            <UserTierInfo tierInfo={tierInfo} />
          </Card>
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
        </>
      ) : (
        <Card {...cardCommonProps} className="lg:col-span-2">
          <TierSelectionWrapper displayNavigationButtons={false} />
        </Card>
      )}

      <Card {...cardCommonProps} className="lg:col-span-2">
        <ManageBilling userStatus={user.userStatus} onError={setError} />
      </Card>
    </div>
  );
};

export default Billing;
