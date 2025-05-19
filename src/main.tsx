import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App.tsx';
import { router } from './router.tsx';

import { isProduction } from '@common/utils.ts';

import '@styles/index.css';

import '@common/i18n';

async function enableMocking(): Promise<void> {
  if (isProduction) {
    return;
  }

  const { worker } = await import('@api/mocks/browser.ts');
  await worker.start({
    onUnhandledRequest: 'bypass'
  });
}

const rootElement = document.querySelector('#root') as Element;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  void enableMocking().then(() => {
    root.render(
      <React.StrictMode>
        <React.Suspense fallback="loading">
          <App router={router} />
        </React.Suspense>
      </React.StrictMode>
    );
  });
}
