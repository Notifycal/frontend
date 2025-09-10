import { createHashHistory, createRouter } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen.ts';

import { NotFoundPage } from './pages/NotFoundPage.tsx';

import FullPageError from '@components/ui/FullPageError/FullPageError.tsx';
import FullPageOverlaySpinner from '@components/ui/FullPageOverlaySpinner/FullPageOverlaySpinner.tsx';

const history = createHashHistory();

export const router = createRouter({
  routeTree,
  history,
  // defaultPreload: 'intent', // routes will be preloaded by default when the user hovers over a <Link>.
  context: {
    auth: undefined!,
    queryClient: undefined!
  },
  defaultNotFoundComponent: NotFoundPage,
  defaultErrorComponent: ({ error, reset }) => (
    <FullPageError
      errorMessage={error.message}
      onRetry={() => {
        reset();
        window.location.reload();
      }}
    />
  ),
  defaultPendingComponent: FullPageOverlaySpinner,
  defaultPendingMs: 0
});

export interface StaticDataRoute {
  layout?: {
    header?: {
      useFancyHeader: boolean;
      fancyHeaderTitle: string;
    };
    container?: {
      narrow: boolean;
    };
  };
}

declare module '@tanstack/react-router' {
  interface Register {
    // This infers the type of our router and registers it across your entire project
    router: typeof router;
  }
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface StaticDataRouteOption extends StaticDataRoute {}
}
