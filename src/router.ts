import { createRouter } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen.ts';

import { NotFoundPage } from './pages/NotFoundPage.tsx';

export const router = createRouter({
  routeTree,
  // defaultPreload: 'intent', // routes will be preloaded by default when the user hovers over a <Link>.
  context: {
    auth: undefined!
  },
  defaultNotFoundComponent: NotFoundPage
});

declare module '@tanstack/react-router' {
  interface Register {
    // This infers the type of our router and registers it across your entire project
    router: typeof router;
  }
  interface StaticDataRouteOption {
    layout?: {
      useFancyHeader: boolean;
      fancyHeaderTitle: string;
    };
  }
}
