import { http, HttpResponse } from 'msw';
import { fakeAuthResponse } from './common';

export const loginHandlers = [
  http.post('/api/v1/login', () => {
    return HttpResponse.json(fakeAuthResponse);
  }),
];
