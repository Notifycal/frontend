import { getCheckoutURL, type PaymentSession } from '@api/payments';
import type { TierId } from '@config/pricing';
import { getServiceConfig } from '@config/serviceConfig';

import { useMutation } from '@tanstack/react-query';
import { useState, type FC } from 'react';
import { useTranslation } from 'react-i18next';

import clsx from 'clsx';
import { Title, Card, Button, Badge } from '@mantine/core';

const tierOrder = ['good', 'better', 'best'] as const;

const tierExtraInfo = {
  good: {
    recommended: false,
    displayName: 'Solo',
  },
  better: {
    recommended: true,
    displayName: 'Team',
  },
  best: {
    recommended: false,
    displayName: 'Pro',
  }
};

const Test: FC = () => {
  const { t } = useTranslation('onboarding');

  const [selectedTier, setSelectedTier] = useState<string | null>(null);

  const { TIER_INFO } = getServiceConfig();
  const orderedTierInfo = tierOrder.map((tierId) => ({ ...TIER_INFO[tierId], ...tierExtraInfo[tierId], id: tierId }));

  const generateCheckoutURLMutation = useMutation<PaymentSession, Error, TierId>({
    mutationFn: getCheckoutURL,
    onSuccess: (data) => {
      console.log(data);
      window.location.href = data.result.url;
    },
    onError: (error) => {
      //TODO: display user-friendly error
      console.log(error);
    },
    onSettled: () => {
      setSelectedTier(null);
    }
  });

  const isButtonLoading = (tierId: TierId): boolean => selectedTier === tierId && generateCheckoutURLMutation.isPending;

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <Title className="text-center mb-12" order={2}>
        Elige tu plan
      </Title>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {orderedTierInfo.map((plan) => (
          <Card
            key={plan.displayName}
            withBorder
            padding="lg"
            radius="md"
            shadow="md"
            className={clsx(
              'relative transition-transform h-full flex flex-col justify-between',
              plan.recommended
                ? 'scale-105 bg-indigo-700 text-white border-indigo-600 shadow-lg hover:shadow-2xl transition-shadow duration-300'
                : 'hover:scale-[1.02] bg-white text-gray-900'
            )}
          >
            {plan.recommended && (
              <div className="absolute top-4 right-4">
                <Badge color="yellow" radius="sm" size="lg" variant="filled">
                  {t('payment.popularBadge')}
                </Badge>
              </div>
            )}

            <div className="text-center space-y-2">
              <div className="text-xl font-semibold">{plan.displayName}</div>
              <div className="text-sm opacity-80 min-h-[3.5rem] flex items-start justify-center text-center">
                {t(`payment.tierDescriptions.${plan.id}`)}
              </div>

              <div className="flex justify-center items-baseline gap-1">
                <div className="text-4xl font-bold">{plan.priceEur}€</div>
                <div className="text-sm opacity-80">/{t('generic.month', { ns: 'translations' })}</div>
              </div>
              <Button
                fullWidth
                color={plan.recommended ? 'dark' : 'blue'}
                loading={isButtonLoading(plan.id)}
                mt="sm"
                variant={plan.recommended ? 'white' : 'outline'}
                onClick={() => {
                  setSelectedTier(plan.id);
                  generateCheckoutURLMutation.mutate(plan.id);
                }}
              >
                {t('generic.button.select', { ns: 'translations' })}
              </Button>
              <div className="mt-4 min-h-[8rem] flex flex-col gap-2 items-center text-sm opacity-80">
                <div>✔ {t('payment.numberOfMonthlyReminders', { qty: plan.numberOfReminders.toLocaleString() })}</div>
                <div>✔ {t('payment.googleCalendarIntegration')}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>
      <div className="mt-4 text-sm text-center text-gray-500 max-w-2xl mx-auto">* {t('payment.disclaimer')}</div>
    </div>
  );
};

export default Test;
