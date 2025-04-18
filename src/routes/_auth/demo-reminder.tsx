import PreFullPage from '@components/layout/PreFullPage';
import DemoReminder from '@pages/DemoReminder';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_auth/demo-reminder')({
  component: () => (
    <PreFullPage>
      <DemoReminder />
    </PreFullPage>
  )
});
