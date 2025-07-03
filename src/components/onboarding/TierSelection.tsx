import { getCheckoutURL, type PaymentSession } from '@api/payments';

import { getServiceConfig } from '@config/serviceConfig';

import { useMutation } from '@tanstack/react-query';
import { type ReactNode, useState, type FC } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import clsx from 'clsx';
import { Card, Button, Badge } from '@mantine/core';
import FlatError from '@components/ui/FlatError/FlatError';
import { Link } from '@tanstack/react-router';
import type { TierId } from '@notifycal/shared/types';

export type TierSelectionValues = unknown;

const tierOrder = ['good', 'better', 'best'] as const;

const tierExtraInfo = {
  good: {
    recommended: false,
    displayName: 'Solo'
  },
  better: {
    recommended: true,
    displayName: 'Team'
  },
  best: {
    recommended: false,
    displayName: 'Pro'
  }
};

const TierSelection: FC = () => {
  const translationNs = 'onboarding' as const;
  const { t } = useTranslation(translationNs);

  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [error, setError] = useState<ReactNode | null>(null);

  const { TIER_INFO: { tiers } } = getServiceConfig();
  const orderedTierInfo = tierOrder.map((tierId) => ({ ...tiers[tierId], ...tierExtraInfo[tierId], id: tierId }));

  const generateCheckoutURLMutation = useMutation<PaymentSession, Error, TierId>({
    mutationFn: getCheckoutURL,
    onSuccess: (result) => {
      console.log(result);
      window.location.href = result.url;
    },
    onError: () => {
      setError(
        <Trans
          components={[<Link className="underline text-blue-600" to="/feedback" />]}
          i18nKey="tierSelection.checkoutURLApiError"
          ns={translationNs}
        />
      );
    },
    onSettled: () => {
      setSelectedTier(null);
    }
  });

  const isButtonLoading = (tierId: TierId): boolean => selectedTier === tierId && generateCheckoutURLMutation.isPending;

  return (
    <div className="max-w-6xl mx-auto px-4">
      {!generateCheckoutURLMutation.isPending && generateCheckoutURLMutation.isError && error && (
        <div className="mb-10">
          <FlatError
            onErrorClose={() => {
              setError(null);
            }}
          >
            {error}
          </FlatError>
        </div>
      )}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-6 lg:gap-12">
        {orderedTierInfo.map((plan) => (
          <div key={plan.displayName}>
            {plan.recommended && (
              <div className="relative sm:mx-5 lg:mx-15">
                <Badge
                  fullWidth
                  className="absolute left-1/2 -translate-x-1/2 -top-5 z-10"
                  color="yellow"
                  radius="sm"
                  size="lg"
                  variant="filled"
                >
                  {t('tierSelection.popularBadge')}
                </Badge>
              </div>
            )}
            <Card
              withBorder
              padding="lg"
              radius="md"
              shadow="md"
              className={clsx(
                'transition-transform h-full flex flex-col justify-between',
                plan.recommended
                  ? 'hover:scale-[1.07] scale-105 bg-indigo-700 text-white border-indigo-600 shadow-lg hover:shadow-2xl transition-shadow duration-300'
                  : 'hover:scale-[1.02] bg-white text-gray-900'
              )}
            >
              <div className="space-y-2">
                <div className="text-xl font-semibold">{plan.displayName}</div>
                <div className="text-sm opacity-80 min-h-[3.5rem] flex items-start justify-start">
                  {t(`tierSelection.tierDescriptions.${plan.id}`)}
                </div>

                <div className="flex justify-start items-baseline gap-1">
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
                <div className="mt-4 min-h-[8rem] flex flex-col gap-2 items-start text-sm opacity-80">
                  <div>
                    ✔ {t('tierSelection.numberOfMonthlyReminders', { qty: plan.numberOfReminders.toLocaleString() })}
                  </div>
                  <div>✔ {t('tierSelection.googleCalendarIntegration')}</div>
                </div>
              </div>
            </Card>
          </div>
        ))}
      </div>
        {/* TODO: take value from tierinfo */}
      <div className="mt-8 text-sm text-center text-gray-500 max-w-2xl mx-auto">* {t('tierSelection.disclaimer')}</div>
    </div>
  );
};

export default TierSelection;
