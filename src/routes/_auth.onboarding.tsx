import PreFullPage from '@components/layout/PreFullPage';
import Onboarding from '@pages/Onboarding';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_auth/onboarding')({
  component: () => (
    <PreFullPage>
      <Onboarding />
    </PreFullPage>
  )
});
