import { Button, Card, Group, Skeleton, Text, Title } from '@mantine/core';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { getTopupCheckoutURL, type PaymentSession } from '@api/payments';
import { getServiceConfig } from '@config/serviceConfig';
import type { User, IdpName, TopupId } from '@notifycal/shared/types';
import type { FC } from 'react';

interface TopUpCardProps {
  user: User<IdpName> | undefined;
  isLoadingUser: boolean;
}

const TopUpCard: FC<TopUpCardProps> = ({ user, isLoadingUser }) => {
  const { t } = useTranslation();

  const {
    TIER_INFO: { topups }
  } = getServiceConfig();

  const topupArray = Object.entries(topups).map(([topupKey, topup]) => {
    return {
      ...topup,
      id: topupKey as TopupId
    };
  });

  const generateTopupCheckoutURLMutation = useMutation<PaymentSession, Error, TopupId>({
    mutationFn: getTopupCheckoutURL,
    onSuccess: (result) => {
      window.location.href = result.url;
    },
    onError: () => {
      console.log('error');
    }
  });

  const handleAddCredits = (topupId: TopupId): void => {
    generateTopupCheckoutURLMutation.mutate(topupId);
  };

  return (
    <Card withBorder padding="lg" radius="md" shadow="sm">
      <Title order={2}>{t('billing.topUp.title')}</Title>

      {(isLoadingUser || generateTopupCheckoutURLMutation.isPending) && (
        <>
        {/* TODO: review this */}
          <Skeleton height={8} mt="sm" />
          <Skeleton height={8} mt="sm" width="70%" />
        </>
      )}

      {user && (
        <>
          <Text mt="sm">{t('billing.topUp.currentCredits', { credits: user.credits?.topupCreditBalance })}</Text>
          <Group justify="flex-end" mt="md">
            {topupArray.map(({ id }) => (
              <Button
                key={id}
                loading={generateTopupCheckoutURLMutation.isPending}
                onClick={() => {
                  handleAddCredits(id);
                }}
              >
                {t('billing.topUp.addCredits')}
              </Button>
            ))}
          </Group>
        </>
      )}
    </Card>
  );
};

export default TopUpCard;
