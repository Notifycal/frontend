import { getCheckoutURL, type PaymentSession } from '@api/payments';
import { getServiceConfig } from '@config/serviceConfig';
import type { TierId } from '@notifycal/shared/types';
import { tierOrder, tierExtraInfo } from '@constants/tiers';

import { useMutation } from '@tanstack/react-query';
import { type ReactNode, useState, type FC } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Link } from '@tanstack/react-router';

import FlatError from '@components/ui/FlatError/FlatError';
import { Group } from '@mantine/core';
import TierCard from './TierCard';
import OnboardingBackButton from './OnboardingBackButton';

export type TierSelectionValues = null;

const TierSelection: FC = () => {
  const translationNs = 'onboarding' as const;
  const { t } = useTranslation(translationNs);

  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [error, setError] = useState<ReactNode | null>(null);

  const {
    TIER_INFO: { tiers }
  } = getServiceConfig();
  const orderedTierInfo = tierOrder.map((tierId) => ({ ...tiers[tierId], ...tierExtraInfo[tierId], id: tierId }));

  const generateCheckoutURLMutation = useMutation<PaymentSession, Error, TierId>({
    mutationFn: getCheckoutURL,
    onSuccess: (result) => {
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
  const isButtonDisabled = (tierId: TierId): boolean =>
    selectedTier !== tierId && generateCheckoutURLMutation.isPending;

  const handleTierSelect = (tierId: TierId) => {
    setSelectedTier(tierId);
    generateCheckoutURLMutation.mutate(tierId);
  };

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
          <TierCard
            key={plan.displayName}
            plan={plan}
            isLoading={isButtonLoading(plan.id)}
            isDisabled={isButtonDisabled(plan.id)}
            onSelect={handleTierSelect}
          />
        ))}
      </div>

      <div className="mt-8 text-sm text-center text-gray-500 max-w-2xl mx-auto">* {t('tierSelection.disclaimer')}</div>
      <Group justify="space-between" mt="xl" pt="md">
        <OnboardingBackButton />
      </Group>
    </div>
  );
};

export default TierSelection;
