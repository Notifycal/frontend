import { ErrorBoundary } from 'react-error-boundary';
import type { router } from './router.tsx';

import { MantineProvider } from '@mantine/core';
import { type QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from '@tanstack/react-router';

import { ConditionalAuthProvider } from '@components/providers/ConditionalAuthProvider.tsx';
import { useAuth } from '@providers/AuthProvider.tsx';
import { CookieConsentProvider } from '@providers/CookieConsentProvider.tsx';
import { type JSX, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import FullPageError from '@components/ui/FullPageError/FullPageError.tsx';

import { ReactQueryDevelopmentTools } from '@components/utils/development-tools/ReactQueryDevelopmentTools.tsx';
import { TanStackRouterDevelopmentTools } from '@components/utils/development-tools/TanStackRouterDevelopmentTools';

import { colors } from '@notifycal/shared/theme';

type AppProps = {
  router: typeof router;
  queryClient: QueryClient;
};

const InnerApp = ({ router, queryClient }: AppProps): JSX.Element => {
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

const App = ({ router, queryClient }: AppProps): JSX.Element => {
  const { t } = useTranslation();

  return (
    <MantineProvider
      theme={{
        primaryColor: 'primary',
        colors: colors
      }}
    >
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
        <CookieConsentProvider>
          <ConditionalAuthProvider>
            <QueryClientProvider client={queryClient}>
              <InnerApp queryClient={queryClient} router={router} />
              {/* Development tools */}
              <TanStackRouterDevelopmentTools initialIsOpen={false} position="bottom-right" router={router} />
              <ReactQueryDevelopmentTools initialIsOpen={false} />
            </QueryClientProvider>
          </ConditionalAuthProvider>
        </CookieConsentProvider>
      </ErrorBoundary>
    </MantineProvider>
  );
};

export default App;
