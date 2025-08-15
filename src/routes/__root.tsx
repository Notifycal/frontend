import { createRootRouteWithContext } from '@tanstack/react-router';
import type { QueryClient } from '@tanstack/react-query';

import type { AuthContext } from '@providers/AuthProvider';
import GeneralLayout from '@components/layout/GeneralLayout';

interface MyRouterContext {
  auth: AuthContext;
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: GeneralLayout
});
