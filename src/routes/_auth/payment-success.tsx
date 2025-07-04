import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { type JSX, useEffect } from 'react';

import FullPageSpinner from '@components/ui/FullPageSpinner/FullPageSpinner';

import { sleep } from 'radashi';

function RouteComponent(): JSX.Element {
  const navigate = useNavigate();

  useEffect(() => {
    const run = async (): Promise<void> => {
      await sleep(3000);
      await navigate({ to: '/onboarding/completed' });
    };

    void run();
  }, [navigate]);

  return <FullPageSpinner />;
}

export const Route = createFileRoute('/_auth/payment-success')({
  component: RouteComponent
});
