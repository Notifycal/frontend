import { getCustomerPortalURL, getProductCheckoutURL, type PaymentSession } from '@api/payments';
import { Alert, Button, Divider, Title } from '@mantine/core';
import type { TopupId } from '@notifycal/shared/types';
import { useMutation } from '@tanstack/react-query';
import type { FC } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import UsageBar from '../UsageBar/UsageBar';

interface CreditBalanceProps {
  subscriptionCreditBalance: {
    used: number;
    total: number;
  };
  topupCreditBalance: number;
}

const CreditBalance: FC<CreditBalanceProps> = ({ topupCreditBalance, subscriptionCreditBalance }) => {
  const { t } = useTranslation();

  const generateTopupCheckoutURLMutation = useMutation<PaymentSession, Error, { topup: TopupId }>({
    mutationFn: getProductCheckoutURL,
    onSuccess: (result) => {
      window.location.href = result.url;
    },
    onError: () => {
      console.log('error');
    }
  });

  const { mutate, isPending } = useMutation({
    mutationFn: getCustomerPortalURL,
    onSuccess: (result) => {
      // console.log(result.url);
      window.location.href = result.url;
    },
    onError: () => {
      console.log('error');
    }
  });

  const handleAddCredits = (): void => {
    generateTopupCheckoutURLMutation.mutate({ topup: 'single' });
  };

  return (
    <>
      <Title order={2}>{t('billing.credits.title')}</Title>
      {/* TODO: display subscription used vs remaining (used / remaining). Use colors: green, yellow, red. Bold for fraction */}
      <ul className="list-none px-0">
        <li>
          <Title order={4}>{t('billing.subscription')}</Title>
          {/* {t('billing.credits.currentCredits', { credits: subscriptionCreditBalance, type: t('billing.subscription') })} */}
          <UsageBar usage={{ remaining: subscriptionCreditBalance.used, total: subscriptionCreditBalance.total }} />
          <Alert>
            <Trans
              i18nKey="billing.credits.toIncrementSubscriptionCredits"
              ns="translations"
              components={[
                <span className="underline text-blue-600 cursor-pointer" onClick={() => {
                  if (!isPending) {
                    mutate('subscription_update');
                  }
                }}/>
              ]}
            />
            {/* {t('billing.credits.toIncrementSubscriptionCredits')} */}
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
