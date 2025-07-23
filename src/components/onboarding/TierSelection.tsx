import { getProductCheckoutURL, type TierCheckoutURLPayload } from '@api/payments';
import { tierOrder } from '@constants/tiers';
import type { LanguageCode, TierId } from '@notifycal/shared/types';

import usePaymentRedirectMutation from '@hooks/usePaymentRedirectMutation';
import { useBillingStore } from '@store/useBillingStore';
import { useState, type FC, type ReactNode } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import FlatError from '@components/ui/FlatError/FlatError';
import { Group } from '@mantine/core';
import { Link } from '@tanstack/react-router';
import OnboardingBackButton from './OnboardingBackButton';
import TierCard from './TierCard';

export type TierSelectionValues = null;

const TierSelection: FC = () => {
  const translationNs = 'onboarding' as const;
  const { t, i18n } = useTranslation(translationNs);

  const language = i18n.languages[0] as LanguageCode;

  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [error, setError] = useState<ReactNode | null>(null);

  const { setPurchaseOperation } = useBillingStore();

  const generateCheckoutURLMutation = usePaymentRedirectMutation<TierCheckoutURLPayload>(getProductCheckoutURL, {
    onError: () => {
      setError(
        <Trans
          components={[<Link className="underline text-blue-600" to="/feedback" />]}
          i18nKey="tierSelection.checkoutURLApiError"
          ns={translationNs}
        />
      );
    }
  });

  const isButtonLoading = (tierId: TierId): boolean => selectedTier === tierId && generateCheckoutURLMutation.isPending;
  const isButtonDisabled = (tierId: TierId): boolean =>
    selectedTier !== tierId && generateCheckoutURLMutation.isPending;

  const handleTierSelect = (tierId: TierId): void => {
    setSelectedTier(tierId);
    setPurchaseOperation('tierPurchase');
    generateCheckoutURLMutation.mutate({ tier: tierId, language });
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
        {tierOrder.map((tierId) => {
          return (
            <TierCard
              key={tierId}
              isDisabled={isButtonDisabled(tierId)}
              isLoading={isButtonLoading(tierId)}
              tierId={tierId}
              onSelect={handleTierSelect}
            />
          );
        })}
      </div>

      <div className="mt-8 text-sm text-center text-gray-500 max-w-2xl mx-auto">* {t('tierSelection.disclaimer')}</div>
      <Group justify="space-between" mt="xl" pt="md">
        <OnboardingBackButton />
      </Group>
    </div>
  );
};

export default TierSelection;
