import { setupWorker } from 'msw/browser';

import { loginHandlers } from './handlers/login';
import { refreshHandlers } from './handlers/refresh';
import { userProfileHandlers } from './handlers/userProfile';

console.log('MSW: Initializing worker...');

export const handlers = [
  ...loginHandlers,
  ...refreshHandlers,
  ...userProfileHandlers,
];

export const worker = setupWorker(...handlers);
