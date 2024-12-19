import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';
import { NotFoundPage } from '../pages/NotFoundPage';

import type { AuthContext } from '../hooks/AuthProvider';

interface MyRouterContext {
  auth: AuthContext;
};

export const Route = createRootRouteWithContext<MyRouterContext>()({
  notFoundComponent: NotFoundPage,
  component: () => (
    <>
      <Outlet />
    </>
  )
});
