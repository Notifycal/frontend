import { getCustomerPortalURL } from '@api/payments';
import usePaymentRedirectMutation from '@hooks/usePaymentRedirectMutation';
import { Button, Title } from '@mantine/core';
import type { LanguageCode, UserStatus } from '@notifycal/shared/types';
import { useState, type FC } from 'react';
import { useTranslation } from 'react-i18next';

interface ManageBillingProps {
  onError: (message: string | null) => void;
  userStatus: UserStatus;
}

const ManageBilling: FC<ManageBillingProps> = ({ onError, userStatus }) => {
  const [clickedButton, setClickedButton] = useState<string | null>(null);

  const { t, i18n } = useTranslation();
  const language = i18n.languages[0] as LanguageCode;

  const generateCustomerPortalURLMutation = usePaymentRedirectMutation(getCustomerPortalURL, {
    onError: () => {
      setClickedButton(null);
      onError(t('billing.manage.error.customerPortal'));
    }
  });

  const allButtons = [
    {
      id: 'update_subscription',
      flowType: 'subscription_update' as const,
      buttonText: t('billing.manage.modifySubscription.button'),
      explanationText: t('billing.manage.modifySubscription.explanation'),
      hiddenOn: ['cancelled']
    },
    {
      id: 'payment_method',
      flowType: 'payment_method_update' as const,
      buttonText: t('billing.manage.paymentMethods.button'),
      explanationText: t('billing.manage.paymentMethods.explanation'),
      hiddenOn: ['cancelled']
    },
    {
      id: 'invoices',
      flowType: undefined,
      buttonText: t('billing.manage.invoices.button'),
      explanationText: t('billing.manage.invoices.explanation'),
      hiddenOn: []
    },
    {
      id: 'portal',
      flowType: undefined,
      buttonText: t('billing.manage.customerPortal.button'),
      explanationText: t('billing.manage.customerPortal.explanation'),
      hiddenOn: []
    }
  ] as const;
  const buttons = allButtons.filter((button) => !button.hiddenOn.some((status) => status === userStatus));

  return (
    <>
      <Title className="pb-6" order={2}>
        {t('billing.manage.title')}
      </Title>
      <ul className="px-0 flex flex-col gap-5">
        {buttons.map(({ id, flowType, buttonText, explanationText }) => (
          <div key={id} className="flex flex-col gap-1 md:flex-row md:items-center md:gap-5">
            <span className="w-full md:w-1/2">{explanationText}</span>
            <Button
              className="w-full md:w-1/2"
              disabled={clickedButton ? clickedButton !== id : false}
              loading={clickedButton === id}
              onClick={() => {
                onError(null);
                setClickedButton(id);
                generateCustomerPortalURLMutation.mutate(flowType ? { language, flowType } : { language });
              }}
            >
              {buttonText}
            </Button>
          </div>
        ))}
      </ul>
    </>
  );
};

export default ManageBilling;
