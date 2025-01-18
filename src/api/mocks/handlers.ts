// src/mocks/handlers.js
import { http, HttpResponse } from 'msw';

export const handlers = [
  // Intercept "GET /api/v1/user-profile" requests...
  http.get('*/api/v1/user-profile', () => {
    // ...and respond to them using this JSON response.
    console.log('Request intercepted by msw');

    return HttpResponse.json({
      SignedUpAt: 1736857377448,
      Status: 'onboarding',
      LastSignInAt: 1737164323173,
      UserId: 'notifycal@gmail.com'
    });
  })
];
