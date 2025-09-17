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
      <h2 className="text-4xl font-bold">{t('billing.credits.title')}</h2>
      <ul className="list-none px-0 my-4">
        <li>
          <h4 className="text-2xl font-bold">{t('billing.subscription')}</h4>
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
          <h4 className="text-2xl font-bold">{t('billing.topup')}</h4>
          <div className="flex flex-col gap-2 md:flex-row md:items-center justify-between w-full">
            {t('billing.credits.currentCredits', { count: topupCreditBalance, type: t('billing.topup') })}
            <Button component="a" loading={generateTopupCheckoutURLMutation.isPending} onClick={handleAddCredits}>
              {t('billing.credits.addTopupCredits')}
            </Button>
          </div>
        </li>
        <Divider my="md" />
        <h4 className="text-2xl font-bold">Coste de recordatorios por país de destino</h4>
        <div className="mt-3 px-1 space-y-2">
          <div className="flex justify-between items-center font-medium py-1 px-6 pl-1">
            <span>País de destino</span>
            <span>Créditos</span>
          </div>
          <div className="flex justify-between items-center hover:bg-gray-50 py-1 px-6 rounded transition-colors">
            <span className="text-dark">España (+34)</span>
            <span className="bg-blue-100 text-blue-800 text-sm font-semibold py-1 px-6 rounded-full">5</span>
          </div>
          <div className="flex justify-between items-center py-1 px-6">
            <span className="text-gray-500">Próximamente más países</span>
            <span className="text-gray-500 px-4">—</span>
          </div>
        </div>
      </ul>
    </>
  );
};

export default CreditBalance;
