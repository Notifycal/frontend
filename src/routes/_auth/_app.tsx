import { createFileRoute } from '@tanstack/react-router';

import AppLayout from '@components/layout/AppLayout';
import { UserProfileProvider } from '@providers/UserProfileProvider';

export const Route = createFileRoute('/_auth/_app')({
  component: () => (
    <UserProfileProvider>
      <AppLayout />
    </UserProfileProvider>
  )
});
