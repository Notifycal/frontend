import React from 'react';
import ReactDOM from 'react-dom/client';

import { RouterProvider, createRouter } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen.ts';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { TanStackRouterDevelopmentTools } from './components/utils/development-tools/TanStackRouterDevelopmentTools';
import { ReactQueryDevelopmentTools } from './components/utils/development-tools/ReactQueryDevelopmentTools.tsx';

import { MantineProvider } from '@mantine/core';

import './styles/index.css';

import './common/i18n';

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    // This infers the type of our router and registers it across your entire project
    router: typeof router;
  }
}

const queryClient = new QueryClient();

const rootElement = document.querySelector('#root') as Element;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <React.Suspense fallback="loading">
        <MantineProvider>
          <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
            <TanStackRouterDevelopmentTools initialIsOpen={false} position="bottom-right" router={router} />
            <ReactQueryDevelopmentTools initialIsOpen={false} />
          </QueryClientProvider>
        </MantineProvider>
      </React.Suspense>
    </React.StrictMode>
  );
}
