import { getProductCheckoutURL, type TierCheckoutURLPayload } from '@api/payments';
import { getUserProfile } from '@api/userProfile';

import type { LanguageCode, TierId } from '@notifycal/shared/types';

import usePaymentRedirectMutation from '@hooks/usePaymentRedirectMutation';
import { useBillingStore } from '@store/useBillingStore';
import { useQueryClient } from '@tanstack/react-query';
import { useState, type FC, type ReactNode } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import OnboardingBackButton from '@components/onboarding/OnboardingBackButton';
import FlatError from '@components/ui/FlatError/FlatError';
import PricingCalculator from '@components/ui/PricingCalculator/PricingCalculator';
import { Group } from '@mantine/core';
import type { TierInfoWithIcon } from '@notifycal/shared/components';
import { Link } from '@tanstack/react-router';
import TierSelectionWithRecommendation from './TierSelectionWithRecommendation';

interface TierSelectionProps {
  displayNavigationButtons?: boolean;
  orderedTierInfoWithIcons: Array<TierInfoWithIcon>;
  showPricingCalculator?: boolean;
}

export type TierSelectionValues = null;

const TierSelection: FC<TierSelectionProps> = ({
  displayNavigationButtons,
  orderedTierInfoWithIcons,
  showPricingCalculator = false
}: TierSelectionProps) => {
  const translationNs = 'onboarding' as const;
  const { i18n } = useTranslation(translationNs);
  const queryClient = useQueryClient();

  const language = i18n.languages[0] as LanguageCode;

  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [error, setError] = useState<ReactNode | null>(null);
  const [recommendedTier, setRecommendedTier] = useState<TierId | null>(null);

  const { setPurchaseOperation, setPreviousUserStatus } = useBillingStore();

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

  const handleTierSelect = async (tierId: TierId): Promise<void> => {
    const user = await queryClient.ensureQueryData({
      queryKey: ['user-profile'],
      queryFn: getUserProfile
    });

    setSelectedTier(tierId);
    setPurchaseOperation('tierPurchase');
    setPreviousUserStatus(user.userStatus);
    generateCheckoutURLMutation.mutate({ tier: tierId, language });
  };

  return (
    <div className="max-w-7xl mx-auto px-4">
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

      <div>
        <TierSelectionWithRecommendation
          isCardButtonDisabled={isButtonDisabled}
          isCardButtonLoading={isButtonLoading}
          lang={language}
          orderedTierInfoWithIcons={orderedTierInfoWithIcons}
          recommendedTier={showPricingCalculator ? recommendedTier : null}
          onTierSelection={handleTierSelect}
        />
      </div>

      {showPricingCalculator && (
        <div className="mt-10">
          <PricingCalculator
            collapsible
            orderedTierInfoWithIcons={orderedTierInfoWithIcons}
            onTierRecommendation={setRecommendedTier}
            onTierSelect={handleTierSelect}
          />
        </div>
      )}

      {displayNavigationButtons && (
        <Group justify="space-between" mt="xl" pt="md">
          <OnboardingBackButton />
        </Group>
      )}
    </div>
  );
};

export default TierSelection;
