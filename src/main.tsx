import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App.tsx';
import { router } from './router.tsx';

import { isProduction } from '@common/utils.ts';

import '@styles/index.css';

import '@common/i18n';
import { initializeApiClient } from '@api/common.ts';
import { getServiceConfig, loadServiceConfig } from '@config/serviceConfig.ts';
import { QueryClient } from '@tanstack/react-query';

async function enableMocking(): Promise<void> {
  if (isProduction) {
    return;
  }

  const { worker } = await import('@api/mocks/browser.ts');
  await worker.start({
    onUnhandledRequest: 'bypass'
  });
}

loadServiceConfig();
const config = getServiceConfig();
initializeApiClient(config.BACKEND_BASE_URL);

const queryClient = new QueryClient();

const rootElement = document.querySelector('#root') as Element;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  void enableMocking().then(() => {
    root.render(
      <React.StrictMode>
        <React.Suspense fallback="loading">
          <App queryClient={queryClient} router={router} />
        </React.Suspense>
      </React.StrictMode>
    );
  });
}
