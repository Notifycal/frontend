import type { QueryClient } from '@tanstack/react-query';
import { createRootRouteWithContext } from '@tanstack/react-router';

import AppLayout from '@components/layout/GeneralLayout';
import type { AuthContext } from '@providers/AuthProvider';

interface MyRouterContext {
  auth: AuthContext;
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: AppLayout
});
