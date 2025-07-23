import type { HttpHandler } from 'msw';
import { getLoginHandlers } from './handlers/login';
import { getRefreshHandlers } from './handlers/refresh';
import { getUserProfileHandlers } from './handlers/userProfile';

export const getMSWHandlers = (): Array<HttpHandler> => [
  ...getLoginHandlers(),
  ...getRefreshHandlers(),
  ...getUserProfileHandlers()
];
