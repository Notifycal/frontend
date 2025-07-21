import { http, HttpResponse } from 'msw';

export const userProfileHandlers = [
  http.get('/api/v1/user-profile', () => {
    return HttpResponse.json({
      result: {
        userId: '34ee63f4-8ef8-520d-81c1-afb3323fc14b',
        email: 'notifycal@gmail.com',
        idp: 'google.com',
        idpId: '115891966119018277387',
        lastSignInAt: 1753116504538,
        signedUpAt: 1753116504538,
        userStatus: 'demo',
        config: {
          calendars: [
            {
              id: 'bbf37e0c3b2dbf6fa2a2ada2e2c96c775e4e6987fb8a3bbcbc2f23f84bd3620b@group.calendar.google.com',
              name: 'TestingSergio',
              template: {
                id: 'formal-es-01',
                language: 'es'
              }
            }
          ],
          business: {
            name: 'dfgtfgfgddfg',
            address: 'dfgfgfgdfg',
            senderContact: {
              type: 'phone',
              countryCode: 'ES',
              phoneNumber: '666666666'
            },
            language: 'es',
            companyIndustry: {
              category: 'healthcare',
              subcategory: 'dentists'
            },
            companySize: 'xs'
          },
          confirmation: {
            termsAccepted: '2025-07-21T16:48:31.033Z',
            privacyAccepted: '2025-07-21T16:48:31.033Z'
          }
        },
        credits: {
          subscriptionCreditBalance: 320,
          tier: 'good',
          topupCreditBalance: 100
        }
      }
    });
  })
];
