import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from '@tanstack/react-router';

import { GoogleOAuthProvider } from '@react-oauth/google';

import { MantineProvider } from '@mantine/core';

import type { router } from './router.ts';

import { ReactQueryDevelopmentTools } from './components/utils/development-tools/ReactQueryDevelopmentTools.tsx';
import { TanStackRouterDevelopmentTools } from './components/utils/development-tools/TanStackRouterDevelopmentTools';

import type { FunctionComponent } from './common/types.ts';

// TODO: How to handle this for different environments?
const GOOGLE_CLIENT_ID = '658640078137-omuaokg6rcajv50879674moielbpvljl.apps.googleusercontent.com';

const queryClient = new QueryClient();

type AppProps = {
  router: typeof router;
};

const App = ({ router }: AppProps): FunctionComponent => {
  return (
    <MantineProvider>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
          {/* Development tools */}
          <TanStackRouterDevelopmentTools initialIsOpen={false} position="bottom-right" router={router} />
          <ReactQueryDevelopmentTools initialIsOpen={false} />
        </QueryClientProvider>
      </GoogleOAuthProvider>
    </MantineProvider>
  );
};

export default App;
