import { getCustomerPortalURL, getProductCheckoutURL, type TopupCheckoutURLPayload } from '@api/payments';
import type { LanguageCode } from '@notifycal/shared/types';
import type { FC } from 'react';

import usePaymentRedirectMutation from '@hooks/usePaymentRedirectMutation';
import { useBillingStore } from '@store/useBillingStore';
import { Trans, useTranslation } from 'react-i18next';

import { Alert, Button, Divider } from '@mantine/core';
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
      <h2 className="text-4xl font-bold font-secondary">{t('billing.credits.title')}</h2>
      <ul className="list-none px-0 my-4">
        <li>
          <h4 className="text-2xl font-bold font-secondary">{t('billing.subscription')}</h4>
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
          <h4 className="text-lg font-bold font-secondary">{t('billing.topup')}</h4>
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
