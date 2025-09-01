import { getProductCheckoutURL, type TierCheckoutURLPayload } from '@api/payments';
import { getUserProfile } from '@api/userProfile';

import type { LanguageCode, TierId } from '@notifycal/shared/types';

import usePaymentRedirectMutation from '@hooks/usePaymentRedirectMutation';
import { useBillingStore } from '@store/useBillingStore';
import { useQueryClient } from '@tanstack/react-query';
import { useState, type FC, type ReactNode } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import FlatError from '@components/ui/FlatError/FlatError';
import { Group } from '@mantine/core';
import { TierSelection as TierSelectionBase, type TierInfoWithIcon } from '@notifycal/shared/components';
import { Link } from '@tanstack/react-router';
import OnboardingBackButton from '@components/onboarding/OnboardingBackButton';

interface TierSelectionProps {
  displayNavigationButtons?: boolean;
  orderedTierInfoWithIcons: Array<TierInfoWithIcon>;
}

export type TierSelectionValues = null;

const TierSelection: FC<TierSelectionProps> = ({
  displayNavigationButtons,
  orderedTierInfoWithIcons
}: TierSelectionProps) => {
  const translationNs = 'onboarding' as const;
  const { t, i18n } = useTranslation(translationNs);
  const queryClient = useQueryClient();

  const language = i18n.languages[0] as LanguageCode;

  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [error, setError] = useState<ReactNode | null>(null);

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
      <TierSelectionBase
        isCardButtonDisabled={isButtonDisabled}
        isCardButtonLoading={isButtonLoading}
        lang={language}
        orderedTierInfoWithIcons={orderedTierInfoWithIcons}
        onTierSelection={handleTierSelect}
      />

      {displayNavigationButtons && (
        <Group justify="space-between" mt="xl" pt="md">
          <OnboardingBackButton />
        </Group>
      )}
    </div>
  );
};

export default TierSelection;
