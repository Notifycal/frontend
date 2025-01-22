// src/mocks/handlers.js
import { delay, http, HttpResponse } from 'msw';

let userStatus = 'onboarding';

export const handlers = [
  http.get('*/api/v1/user-calendars', async () => {
    await delay(2500);
    return HttpResponse.json({
      Calendars: ['foobar@gmail.com', 'foobar2@gmail.com', 'foobar3@gmail.com']
    });
  }),
  // Intercept "GET /api/v1/user-profile" requests...
  http.get('*/api/v1/user-profile', async () => {
    // ...and respond to them using this JSON response.
    await delay(2500);
    return HttpResponse.json({
      SignedUpAt: 1736857377448,
      Status: userStatus,
      LastSignInAt: 1737164323173,
      UserId: 'notifycal@gmail.com'
    });
  }),
  http.put('*/api/v1/user-profile', async () => {
    userStatus = 'live';
    await delay(2500);
    return new Response(null, {
      status: 200
    });
  }),
  http.get('*/api/v1/user-profile', async () => {
    // ...and respond to them using this JSON response.

    await delay(2500);
    return HttpResponse.json({
      SignedUpAt: 1736857377448,
      Status: userStatus,
      LastSignInAt: 1737164323173,
      UserId: 'notifycal@gmail.com'
    });
  })
];
