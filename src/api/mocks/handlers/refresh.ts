import { http, HttpResponse } from 'msw';
import { fakeAuthResponse } from './common';

export const refreshHandlers = [
  http.post('/api/v1/refresh', () => {
    return HttpResponse.json(fakeAuthResponse);
  })
];
