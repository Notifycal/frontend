import { getUserProfile } from '@/api/userProfile';
import { capitalize } from 'radashi';
import type { JSX } from 'react';

import useExtendedTierInfo from '@hooks/useExtendedTierInfo';
import { useQuery } from '@tanstack/react-query';
import { Trans, useTranslation } from 'react-i18next';

import { IconCircleCheckFilled } from '@tabler/icons-react';
import { Alert, Card, Divider, Title } from '@mantine/core';
import ManageBilling from '@components/ui/ManageBilling/ManageBilling';
import CreditBalance from '@components/ui/CreditBalance/CreditBalance';
import TierFeatures from '@components/ui/TierFeatures/TierFeatures';

const Billing = (): JSX.Element => {
  const { t } = useTranslation('onboarding');
  const { data: user, isError } = useQuery({
    queryKey: ['user-profile'],
    queryFn: getUserProfile
  });

  if (isError || !user?.credits?.tier) {
    throw new Error(t('billing.error.noUserData', { ns: 'translations' }));
  }

  const tierInfo = useExtendedTierInfo(user.credits.tier);
  const { icon: TierIcon } = tierInfo;

  const cardCommonProps = {
    withBorder: true,
    padding: 'lg',
    radius: 'md',
    shadow: 'md'
  };

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <Card {...cardCommonProps}>
        {tierInfo && (
          <>
            <Title className="flex items-center gap-2" order={1}>
              <TierIcon className="inline w-[1em] h-[1em] text-amber-400" />
              {tierInfo.displayName}
            </Title>
            <div>
              <Trans
                components={[<span className="font-bold" />]}
                i18nKey="billing.currentPlan"
                ns="translations"
                values={{ tierName: tierInfo.displayName }}
              />
            </div>
            <Divider my="md" />

            <div>{t('billing.yourPlanIncludes', { ns: 'translations' })}</div>
            <TierFeatures icon={IconCircleCheckFilled} tier={tierInfo} />
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
        )}
      </Card>

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
