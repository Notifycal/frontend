import type { FunctionComponent } from '@common/types';
import { Button, Card, Container, Stack, Text, ThemeIcon } from '@mantine/core';
import { IconArrowLeft, IconCheck } from '@tabler/icons-react';
import { Link } from '@tanstack/react-router';

export const PaymentSuccess = (): FunctionComponent => {
  return (
    <Container py="xl" size="sm">
      <Card withBorder padding="xl" radius="md" shadow="sm">
        <Stack align="center" gap="lg">
          <ThemeIcon color="green" radius="xl" size={80} variant="light">
            <IconCheck size="2.5rem" />
          </ThemeIcon>

          <Stack align="center" gap="sm">
            <Text c="green" fw={700} size="xl">
              Payment Successful!
            </Text>

            <Text c="dimmed" size="sm" ta="center">
              Thank you for your subscription. Your account has been upgraded and you now have access to all premium
              features.
            </Text>
          </Stack>

          <Button
            component={Link}
            leftSection={<IconArrowLeft size="1rem" />}
            size="md"
            to="/dashboard"
            variant="filled"
          >
            Go to Dashboard
          </Button>
        </Stack>
      </Card>
    </Container>
  );
};
