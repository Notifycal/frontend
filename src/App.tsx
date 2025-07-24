import type { FunctionComponent } from '@common/types.ts';
import { getServiceConfig } from '@config/serviceConfig.ts';
import { ErrorBoundary } from 'react-error-boundary';
import type { router } from './router.tsx';

import { MantineProvider } from '@mantine/core';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from '@tanstack/react-router';

import { AuthProvider, useAuth } from '@hooks/AuthProvider.tsx';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import FullPageError from '@components/ui/FullPageError/FullPageError.tsx';

import { ReactQueryDevelopmentTools } from '@components/utils/development-tools/ReactQueryDevelopmentTools.tsx';
import { TanStackRouterDevelopmentTools } from '@components/utils/development-tools/TanStackRouterDevelopmentTools';

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

  return <RouterProvider context={{ auth, queryClient }} router={router} />;
};

const App = ({ router }: AppProps): FunctionComponent => {
  const { t } = useTranslation();
  const { GOOGLE_CLIENT_ID } = getServiceConfig();

  return (
    <MantineProvider>
      <ErrorBoundary
        fallback={
          <FullPageError
            errorMessage={t('globalError.genericError')}
            onRetry={() => {
              window.location.reload();
            }}
          />
        }
      >
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
          <QueryClientProvider client={queryClient}>
            <AuthProvider>
              <InnerApp router={router} />
              {/* Development tools */}
              <TanStackRouterDevelopmentTools initialIsOpen={false} position="bottom-right" router={router} />
              <ReactQueryDevelopmentTools initialIsOpen={false} />
            </AuthProvider>
          </QueryClientProvider>
        </GoogleOAuthProvider>
      </ErrorBoundary>
    </MantineProvider>
  );
};

export default App;
