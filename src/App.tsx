import { MantineProvider } from '@mantine/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from '@tanstack/react-router';

import type { router } from './router.ts';

import { ReactQueryDevelopmentTools } from './components/utils/development-tools/ReactQueryDevelopmentTools.tsx';
import { TanStackRouterDevelopmentTools } from './components/utils/development-tools/TanStackRouterDevelopmentTools';

import type { FunctionComponent } from './common/types.ts';

const queryClient = new QueryClient();

type AppProps = {
  router: typeof router;
};

const App = ({ router }: AppProps): FunctionComponent => {
  return (
    <MantineProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        {/* Development tools */}
        <TanStackRouterDevelopmentTools initialIsOpen={false} position="bottom-right" router={router} />
        <ReactQueryDevelopmentTools initialIsOpen={false} />
      </QueryClientProvider>
    </MantineProvider>
  );
};

export default App;
