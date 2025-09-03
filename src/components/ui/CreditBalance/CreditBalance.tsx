import { getCustomerPortalURL, getProductCheckoutURL, type TopupCheckoutURLPayload } from '@api/payments';
import type { LanguageCode } from '@notifycal/shared/types';
import type { FC } from 'react';

import usePaymentRedirectMutation from '@hooks/usePaymentRedirectMutation';
import { useBillingStore } from '@store/useBillingStore';
import { Trans, useTranslation } from 'react-i18next';

import { Alert, Button, Divider, Title } from '@mantine/core';
import ClickableSpan from '../ClickableSpan/ClickableSpan';
import UsageBar from '../UsageBar/UsageBar';

interface CreditBalanceProps {
  subscriptionCreditBalance: {
    used: number;
    total: number;
  };
  topupCreditBalance: number;
  onError: (message: string | null) => void;
}

const CreditBalance: FC<CreditBalanceProps> = ({ topupCreditBalance, subscriptionCreditBalance, onError }) => {
  const { t, i18n } = useTranslation();
  const { setTopupCreditBalance, setPurchaseOperation } = useBillingStore();

  const language = i18n.languages[0] as LanguageCode;

  const generateTopupCheckoutURLMutation = usePaymentRedirectMutation<TopupCheckoutURLPayload>(getProductCheckoutURL, {
    onError: () => {
      onError(t('billing.credits.error.buyMoreCredits'));
    }
  });
  const generateCustomerPortalURLMutation = usePaymentRedirectMutation(getCustomerPortalURL, {
    onError: () => {
      onError(t('billing.credits.error.upgradeSubscription'));
    }
  });

  const handleAddCredits = (): void => {
    onError(null);
    setPurchaseOperation('topupPurchase');
    setTopupCreditBalance(topupCreditBalance);
    generateTopupCheckoutURLMutation.mutate({ topup: 'single', language });
  };

  const handleChangeSubscription = (): void => {
    onError(null);
    generateCustomerPortalURLMutation.mutate({ language, flowType: 'subscription_update' });
  };

  return (
    <>
      <Title order={2}>{t('billing.credits.title')}</Title>
      <ul className="list-none px-0 my-4">
        <li>
          <Title order={4}>{t('billing.subscription')}</Title>
          <UsageBar usage={{ remaining: subscriptionCreditBalance.used, total: subscriptionCreditBalance.total }} />
          <Alert>
            <Trans
              i18nKey="billing.credits.toIncrementSubscriptionCredits"
              ns="translation"
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
