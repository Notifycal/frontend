import { useState, type JSX } from 'react';

import { Route } from '@routes/_auth/_app/billing';

import CreditBalance from '@components/ui/CreditBalance/CreditBalance';
import FlatError from '@components/ui/FlatError/FlatError';
import ManageBilling from '@components/ui/ManageBilling/ManageBilling';
import TierSelection from '@components/ui/TierSelection/TierSelection';
import UserTierInfo from '@components/ui/UserTierInfo/UserTierInfo';
import { getServiceConfig } from '@config/serviceConfig';
import { Card } from '@mantine/core';
import { orderedTierInfoWithIcons as orderedTierInfoWithIconsUtility } from '@notifycal/shared/pricing';
import type { LanguageCode, UserStatus } from '@notifycal/shared/types';
import { useTranslation } from 'react-i18next';

const Billing = (): JSX.Element => {
  const { user } = Route.useLoaderData();

  const {
    TIER_INFO: { tiers }
  } = getServiceConfig();

  const [error, setError] = useState<string | null>(null);

  const { i18n } = useTranslation();
  const lang = i18n.language as LanguageCode;

  const orderedTierInfoWithIcons = orderedTierInfoWithIconsUtility(tiers, lang);
  const tierInfo = orderedTierInfoWithIcons.find((t) => t.id === user.credits?.tier);

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
          <TierSelection displayNavigationButtons={false} orderedTierInfoWithIcons={orderedTierInfoWithIcons} />
        </Card>
      )}

      <Card {...cardCommonProps} className="lg:col-span-2">
        <ManageBilling userStatus={user.userStatus} onError={setError} />
      </Card>
    </div>
  );
};

export default Billing;
