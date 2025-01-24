import { useEffect } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from '@tanstack/react-router';

import { GoogleOAuthProvider } from '@react-oauth/google';

import { MantineProvider } from '@mantine/core';

import { useTranslation } from 'react-i18next';

import { ReactQueryDevelopmentTools } from '@components/utils/development-tools/ReactQueryDevelopmentTools.tsx';
import { TanStackRouterDevelopmentTools } from '@components/utils/development-tools/TanStackRouterDevelopmentTools';

import { AuthProvider, useAuth } from '@hooks/AuthProvider.tsx';
import { ServiceConfigProvider, useServiceConfig } from '@hooks/ServiceConfigProvider.tsx';

import { initializeApiClient } from '@api/common.ts';

import FullScreenError from '@components/ui/FullScreenError/FullScreenError.tsx';

import type { FunctionComponent } from '@common/types.ts';
import type { router } from './router.tsx';

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

const ServiceConfiguredApp = ({ router }: AppProps): FunctionComponent => {
  // Splitting again so we can invoke `useServiceConfig` to pass the Google client id to the
  // 3rd party GoogleOAuthProvider.
  // For our own code/components, we should just call `useServiceConfig()` from a child of InnerApp.
  const { GOOGLE_CLIENT_ID, BACKEND_BASE_URL } = useServiceConfig();

  // We don't expect BACKEND_BASE_URL to change after the app loads, that's why there are no dependencies.
  initializeApiClient(BACKEND_BASE_URL);

  useEffect(() => {
    initializeApiClient(BACKEND_BASE_URL);
  });

  return (
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
  );
};

const App = ({ router }: AppProps): FunctionComponent => {
  const { t } = useTranslation();

  return (
    <MantineProvider>
      <ErrorBoundary
        fallback={
          <FullScreenError
            errorBody={t('globalError.genericError')}
            onRetry={() => {
              window.location.reload();
            }}
          />
        }
      >
        <ServiceConfigProvider>
          <ServiceConfiguredApp router={router} />
        </ServiceConfigProvider>
      </ErrorBoundary>
    </MantineProvider>
  );
};

export default App;
