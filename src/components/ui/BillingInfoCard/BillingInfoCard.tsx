import { Trans, useTranslation } from 'react-i18next';
import { Button, Card, Group, Skeleton, Text, Title } from '@mantine/core';
import type { User, IdpName } from '@notifycal/shared/types';
import type { FC } from 'react';
import { getCustomerPortalURL } from '@api/payments';
import { useMutation } from '@tanstack/react-query';

interface BillingInfoCardProps {
  user: User<IdpName> | undefined;
  isLoadingUser: boolean;
}

const BillingInfoCard: FC<BillingInfoCardProps> = ({ user, isLoadingUser }) => {
  const { t } = useTranslation();

  const generateCustomerPortalURLMutation = useMutation({
    mutationFn: getCustomerPortalURL,
    onSuccess: (result) => {
      window.location.href = result.url;
    },
    onError: () => {
      console.log('error');
    }
  });

  const handleGoToCustomerPortal = (): void => {
    generateCustomerPortalURLMutation.mutate();
  };

  return (
    <Card withBorder padding="lg" radius="md" shadow="sm">
      <Title order={2}>{t('billing.title')}</Title>

      {isLoadingUser && (
        <>
          <Skeleton height={8} mt="sm" />
          <Skeleton height={8} mt="sm" width="70%" />
        </>
      )}

      {/* {isError && <Text c="red">{t('billing.error.fetch')}</Text>} */}

      {user && (
        <>
          <Text mt="sm">
            <Trans
              components={[<span className="font-bold" />]}
              i18nKey="billing.currentPlan"
              values={{ tierName: user.credits?.tier }}
            />
            
            {t('billing.currentPlan', { tierName: user.credits?.tier })}
          </Text>

          <Group justify="flex-end" mt="md">
            <Button component="a" rel="noopener noreferrer" target="_blank" onClick={handleGoToCustomerPortal}>
              {t('billing.manageSubscription')}
            </Button>
          </Group>
        </>
      )}
    </Card>
  );
};

export default BillingInfoCard;
