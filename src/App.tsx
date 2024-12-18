import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from '@tanstack/react-router';

import { GoogleOAuthProvider } from '@react-oauth/google';

import { MantineProvider } from '@mantine/core';

import type { router } from './router.ts';

import { ReactQueryDevelopmentTools } from './components/utils/development-tools/ReactQueryDevelopmentTools.tsx';
import { TanStackRouterDevelopmentTools } from './components/utils/development-tools/TanStackRouterDevelopmentTools';

import type { FunctionComponent } from './common/types.ts';
import AuthProvider, { useAuth } from './hooks/AuthProvider.tsx';

// TODO: How to handle this for different environments?
const GOOGLE_CLIENT_ID = '658640078137-omuaokg6rcajv50879674moielbpvljl.apps.googleusercontent.com';

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
  return (<RouterProvider context={{ auth }} router={router}/>);
};

const App = ({ router }: AppProps): FunctionComponent => {
  return (
    <MantineProvider>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <AuthProvider>
          <QueryClientProvider client={queryClient}>
            <InnerApp router={router}/>
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
