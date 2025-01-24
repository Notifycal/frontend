import { createFileRoute } from '@tanstack/react-router';

import AppLayout from '@components/layout/AppLayout';
import { UserProvider } from '@hooks/UserProvider';

// This route (and all the routes starting with _) is not an actual route
// In fact this defines the layout of all authenticated routes.
export const Route = createFileRoute('/_auth/_app')({
  component: () => (
    <UserProvider>
      <AppLayout />
    </UserProvider>
  )
});
