import { getCustomerPortalURL, getProductCheckoutURL } from '@api/payments';
import { Alert, Button, Divider, Title } from '@mantine/core';
import type { TopupId } from '@notifycal/shared/types';
import type { FC } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import usePaymentRedirectMutation from '@hooks/usePaymentRedirectMutation';
import UsageBar from '../UsageBar/UsageBar';
import ClickableSpan from '../ClickableSpan/ClickableSpan';

interface CreditBalanceProps {
  subscriptionCreditBalance: {
    used: number;
    total: number;
  };
  topupCreditBalance: number;
}

const CreditBalance: FC<CreditBalanceProps> = ({ topupCreditBalance, subscriptionCreditBalance }) => {
  const { t } = useTranslation();

  const onError = (): void => {
    console.log('error');
  };

  const generateTopupCheckoutURLMutation = usePaymentRedirectMutation<{ topup: TopupId }>(getProductCheckoutURL, {
    onError
  });
  const generateCustomerPortalURLMutation = usePaymentRedirectMutation(getCustomerPortalURL, { onError });

  const handleAddCredits = (): void => {
    generateTopupCheckoutURLMutation.mutate({ topup: 'single' });
  };

  const handleChangeSubscription = (): void => {
    generateCustomerPortalURLMutation.mutate('subscription_update');
  };

  return (
    <>
      <Title order={2}>{t('billing.credits.title')}</Title>
      <ul className="list-none px-0">
        <li>
          <Title order={4}>{t('billing.subscription')}</Title>
          <UsageBar usage={{ remaining: subscriptionCreditBalance.used, total: subscriptionCreditBalance.total }} />
          <Alert>
            <Trans
              i18nKey="billing.credits.toIncrementSubscriptionCredits"
              ns="translations"
              components={[
                <ClickableSpan
                  isPending={generateCustomerPortalURLMutation.isPending}
                  loaderProps={{
                    size: 'xs'
                  }}
                  onClick={handleChangeSubscription}
                />
              ]}
            />
          </Alert>
        </li>
        <Divider my="md" />
        <li className="flex flex-col items-start gap-2">
          <Title order={4}>{t('billing.topup')}</Title>
          <div className="flex flex-col gap-2 md:flex-row md:items-center justify-between w-full">
            {t('billing.credits.currentCredits', { count: topupCreditBalance, type: t('billing.topup') })}
            <Button component="a" loading={generateTopupCheckoutURLMutation.isPending} onClick={handleAddCredits}>
              {t('billing.credits.addTopupCredits')}
            </Button>
          </div>
        </li>
      </ul>
    </>
  );
};

export default CreditBalance;
