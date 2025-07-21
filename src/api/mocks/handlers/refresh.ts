import { http, HttpResponse, type HttpHandler } from 'msw';
import { fakeAuthResponse } from './common';

export const getRefreshHandlers = (): Array<HttpHandler> => [
  http.post('/api/v1/refresh', () => HttpResponse.json(fakeAuthResponse))
];
