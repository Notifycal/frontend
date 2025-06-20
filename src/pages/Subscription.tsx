import getApiClient from '@api/common';
import type { FunctionComponent } from '@common/types';
import { Alert, Button, Card, Container, Stack, Text } from '@mantine/core';
import type { LanguageCode } from '@notifycal/shared/types';
import { IconAlertCircle, IconCreditCard } from '@tabler/icons-react';
import axios from 'axios';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface PaymentSessionResponse {
  url: string;
}
interface ApiErrorResponse {
  message: string;
}

export const Subscription = (): FunctionComponent => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { i18n } = useTranslation();

  async function handleCheckout(): Promise<void> {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getApiClient().post<PaymentSessionResponse>('/api/v1/payment-session', {
        tier: 'good',
        language: i18n.languages[0] as LanguageCode
      });
      if (response.data.url) {
        window.location.href = response.data.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error_: unknown) {
      let errorMessage = 'An unexpected error occurred';
      if (axios.isAxiosError<ApiErrorResponse>(error_)) {
        errorMessage = error_.response?.data?.message || error_.message;
      } else if (error_ instanceof Error) {
        errorMessage = error_.message;
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCustomerPortal(): Promise<void> {
    try {
      const response = await getApiClient().post<PaymentSessionResponse>('/api/v1/customer-portal-session');
      if (response.data.url) {
        window.location.href = response.data.url;
      } else {
        throw new Error('No customer portal URL received');
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Container py="xl" size="sm">
      <Card withBorder padding="lg" radius="md" shadow="sm">
        <Stack gap="md">
          <Text fw={600} size="xl" ta="center">
            Subscribe to Premium
          </Text>

          <Text c="dimmed" ta="center">
            Get access to all premium features and priority support
          </Text>

          {error && (
            <Alert color="red" icon={<IconAlertCircle size="1rem" />} title="Payment Error" variant="light">
              {error}
            </Alert>
          )}

          <Button
            fullWidth
            leftSection={<IconCreditCard size="1rem" />}
            loading={isLoading}
            size="lg"
            onClick={handleCheckout}
          >
            {isLoading ? 'Redirecting to checkout...' : 'Start Subscription'}
          </Button>
        </Stack>
      </Card>
      <Button
        fullWidth
        leftSection={<IconCreditCard size="1rem" />}
        loading={isLoading}
        size="lg"
        onClick={handleCustomerPortal}
      >
        Customer Portal
      </Button>
    </Container>
  );
};
