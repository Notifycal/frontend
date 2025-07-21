import { http, HttpResponse, type HttpHandler } from 'msw';
import { fakeAuthResponse } from './common';

export function getLoginHandlers(): Array<HttpHandler> {
  return [http.post('/api/v1/login', () => HttpResponse.json(fakeAuthResponse))];
}
