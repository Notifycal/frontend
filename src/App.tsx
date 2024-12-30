import { useEffect } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from '@tanstack/react-router';

import { GoogleOAuthProvider } from '@react-oauth/google';

import { MantineProvider } from '@mantine/core';

import { ReactQueryDevelopmentTools } from '@components/utils/development-tools/ReactQueryDevelopmentTools.tsx';
import { TanStackRouterDevelopmentTools } from '@components/utils/development-tools/TanStackRouterDevelopmentTools';

import { getConfigValue } from '@common/utils.ts';
import { AuthProvider, useAuth } from '@hooks/AuthProvider.tsx';

import type { FunctionComponent } from '@common/types.ts';
import type { router } from './router.ts';

const GOOGLE_CLIENT_ID = getConfigValue('GOOGLE_CLIENT_ID');

const queryClient = new QueryClient();

type AppProps = {
  router: typeof router;
};

const InnerApp = ({ router }: AppProps): FunctionComponent => {
  // Splitting this from the main App function/component because:
  // useAuth must be used within an AuthProvider. Otherwise it will throw an error.
  // If setting the auth at the top of App, the hook is invoked before the AuthProvider
  // is rendered and tries to read a React context that doesn't exist yet.
  const auth = useAuth();

  // Tanstack's RouterProvider isn't a real React Context, it's basically static. So we have to
  // "manually" call invalidate, which ensures the AuthContext and RouterProvider context are in sync.
  useEffect(() => {
    void router.invalidate();
  }, [router, auth.isAuthenticated]);

  return <RouterProvider context={{ auth }} router={router} />;
};

const App = ({ router }: AppProps): FunctionComponent => {
  return (
    <MantineProvider>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <AuthProvider>
          <QueryClientProvider client={queryClient}>
            <InnerApp router={router} />
            {/* Development tools */}
            <TanStackRouterDevelopmentTools initialIsOpen={false} position="bottom-right" router={router} />
            <ReactQueryDevelopmentTools initialIsOpen={false} />
          </QueryClientProvider>
        </AuthProvider>
      </GoogleOAuthProvider>
    </MantineProvider>
  );
};

export default App;
