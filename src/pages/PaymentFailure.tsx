import type { FunctionComponent } from '@common/types';
import { Button, Card, Container, Group, Stack, Text, ThemeIcon } from '@mantine/core';
import { IconArrowLeft, IconRefresh, IconX } from '@tabler/icons-react';
import { Link } from '@tanstack/react-router';

export const PaymentFailure = (): FunctionComponent => {
  return (
    <Container py="xl" size="sm">
      <Card withBorder padding="xl" radius="md" shadow="sm">
        <Stack align="center" gap="lg">
          <ThemeIcon color="red" radius="xl" size={80} variant="light">
            <IconX size="2.5rem" />
          </ThemeIcon>

          <Stack align="center" gap="sm">
            <Text c="red" fw={700} size="xl">
              Payment Failed
            </Text>

            <Text c="dimmed" size="sm" ta="center">
              We were unable to process your payment. Please check your payment information and try again, or contact
              support if the problem persists.
            </Text>
          </Stack>

          <Group gap="sm">
            <Button
              component={Link}
              leftSection={<IconRefresh size="1rem" />}
              size="md"
              to="/subscription"
              variant="filled"
            >
              Try Again
            </Button>

            <Button
              component={Link}
              leftSection={<IconArrowLeft size="1rem" />}
              size="md"
              to="/dashboard"
              variant="outline"
            >
              Go Back
            </Button>
          </Group>
        </Stack>
      </Card>
    </Container>
  );
};
