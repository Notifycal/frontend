import {
  CAT_ANALYTICS,
  CAT_NECESSARY,
  CAT_SECURITY,
  cookieConsentConfig as commonCookieConsentConfig,
  SERVICE_SECURITY_STORAGE
} from '@notifycal/shared/utils';
import type { CookieConsentConfig, Translation } from 'vanilla-cookieconsent';

type PreferencesModalSection = NonNullable<NonNullable<Translation['preferencesModal']>['sections']>[0];
type CookieTable = NonNullable<PreferencesModalSection['cookieTable']>;

export function cookieConsentConfig(): CookieConsentConfig {
  const baseConfig = commonCookieConsentConfig();

  const config: CookieConsentConfig = {
    ...baseConfig,
    categories: {
      ...baseConfig.categories,
      [CAT_NECESSARY]: {
        enabled: true
      },
      [CAT_SECURITY]: {
        enabled: true,
        autoClear: {
          cookies: [
            {
              name: 'SID',
              domain: '.google.com'
            },
            {
              name: 'HSID',
              domain: '.google.com'
            },
            {
              name: 'SSID',
              domain: '.google.com'
            },
            {
              name: 'APISID',
              domain: '.google.com'
            },
            {
              name: 'SAPISID',
              domain: '.google.com'
            },
            {
              name: '__Secure-1PSID',
              domain: '.google.com'
            },
            {
              name: '__Secure-3PSID',
              domain: '.google.com'
            },
            {
              name: '__Secure-1PAPISID',
              domain: '.google.com'
            },
            {
              name: '__Secure-3PAPISID',
              domain: '.google.com'
            },
            {
              name: 'NID',
              domain: '.google.com'
            },
            {
              name: '_Secure-ENID',
              domain: '.google.com'
            },
            {
              name: '__Secure-ENID',
              domain: '.google.com'
            },
            {
              name: 'AEC',
              domain: '.google.com'
            },
            {
              name: '__Secure-YEC',
              domain: '.google.com'
            },
            {
              name: 'SOCS',
              domain: '.google.com'
            }
          ],
          reloadPage: true
        },
        services: {
          [SERVICE_SECURITY_STORAGE]: {
            label:
              'Enables storage related to security such as authentication functionality, fraud prevention, and other user protection.'
          }
        }
      }
    },
    language: {
      default: 'en',
      translations: {
        en: {
          ...(baseConfig.language?.translations?.['en'] as Translation),
          preferencesModal: {
            ...(baseConfig.language?.translations?.['en'] as Translation)?.preferencesModal,
            sections: [
              {
                title: 'Cookie usage',
                description:
                  'We use cookies to ensure the basic functionalities of the website and to enhance your online experience.'
              },
              {
                title: 'Strictly necessary cookies',
                description:
                  'These cookies are essential for the proper functioning of the website, including user authentication.',
                linkedCategory: CAT_NECESSARY
              },
              {
                title: 'Security & Authentication',
                description:
                  'We use Google authentication for secure login. Google sets security cookies to authenticate users, prevent fraudulent use of login credentials, and protect user data from unauthorized access. These cookies are essential for maintaining your session and ensuring secure access to the platform.',
                linkedCategory: CAT_SECURITY,
                cookieTable: {
                  headers: {
                    name: 'Name',
                    domain: 'Service',
                    description: 'Description',
                    expiration: 'Expiration'
                  },
                  body: [
                    {
                      name: 'SID',
                      domain: 'Google Authentication',
                      description:
                        'Contains digitally signed and encrypted records of a user\'s Google Account ID and most recent sign-in time. The combination of SID and HSID cookies allows Google to block many types of attacks, such as attempts to steal the content of forms submitted in Google services. See <a href="https://policies.google.com/technologies/cookies">Google Cookie Policy</a>',
                      expiration: '2 years'
                    },
                    {
                      name: 'HSID',
                      domain: 'Google Authentication',
                      description:
                        'Contains digitally signed and encrypted records of a user\'s Google Account ID and most recent sign-in time. Works with SID cookie to authenticate users and block many types of attacks. See <a href="https://policies.google.com/technologies/cookies">Google Cookie Policy</a>',
                      expiration: '2 years'
                    },
                    {
                      name: 'SSID',
                      domain: 'Google Authentication',
                      description:
                        'Security cookie similar to SID and HSID used for authentication purposes. See <a href="https://policies.google.com/technologies/cookies">Google Cookie Policy</a>',
                      expiration: '2 years'
                    },
                    {
                      name: 'APISID',
                      domain: 'Google Authentication',
                      description:
                        'Used when accessing Google APIs and for authentication purposes. See <a href="https://policies.google.com/technologies/cookies">Google Cookie Policy</a>',
                      expiration: '2 years'
                    },
                    {
                      name: 'SAPISID',
                      domain: 'Google Authentication',
                      description:
                        'Used for authentication and to play YouTube videos embedded on other websites. See <a href="https://policies.google.com/technologies/cookies">Google Cookie Policy</a>',
                      expiration: '2 years'
                    },
                    {
                      name: '__Secure-1PSID',
                      domain: 'Google Authentication',
                      description:
                        'Secure variant of authentication cookies for enhanced security. See <a href="https://policies.google.com/technologies/cookies">Google Cookie Policy</a>',
                      expiration: '2 years'
                    },
                    {
                      name: '__Secure-3PSID',
                      domain: 'Google Authentication',
                      description:
                        'Third-party secure authentication cookie for cross-domain verification. See <a href="https://policies.google.com/technologies/cookies">Google Cookie Policy</a>',
                      expiration: '2 years'
                    },
                    {
                      name: '__Secure-1PAPISID',
                      domain: 'Google Authentication',
                      description:
                        'Secure authentication cookie variant for enhanced protection. See <a href="https://policies.google.com/technologies/cookies">Google Cookie Policy</a>',
                      expiration: '2 years'
                    },
                    {
                      name: '__Secure-3PAPISID',
                      domain: 'Google Authentication',
                      description:
                        'Third-party secure authentication cookie variant. See <a href="https://policies.google.com/technologies/cookies">Google Cookie Policy</a>',
                      expiration: '2 years'
                    },
                    {
                      name: 'NID',
                      domain: 'Google',
                      description:
                        'Used to remember your preferences and other information, such as your preferred language, how many results you prefer to have shown on a search results page, and whether you want to have Google\'s SafeSearch filter turned on. See <a href="https://policies.google.com/technologies/cookies">Google Cookie Policy</a>',
                      expiration: '6 months'
                    },
                    {
                      name: '_Secure-ENID',
                      domain: 'Google',
                      description:
                        'Enhanced version of NID cookie used to remember your preferences and other information with additional security. See <a href="https://policies.google.com/technologies/cookies">Google Cookie Policy</a>',
                      expiration: '13 months'
                    },
                    {
                      name: 'AEC',
                      domain: 'Google',
                      description:
                        'Used to detect spam, fraud, and abuse to help ensure advertisers are not incorrectly charged for fraudulent or otherwise invalid impressions or interactions with ads. See <a href="https://policies.google.com/technologies/cookies">Google Cookie Policy</a>',
                      expiration: '6 months'
                    },
                    {
                      name: '__Secure-YEC',
                      domain: 'Google',
                      description:
                        'Used to detect spam, fraud, and abuse to help ensure YouTube creators in the YouTube Partner Program are remunerated fairly. See <a href="https://policies.google.com/technologies/cookies">Google Cookie Policy</a>',
                      expiration: '13 months'
                    },
                    {
                      name: 'SOCS',
                      domain: 'Google',
                      description:
                        'Stores a user\'s state regarding their cookies choices. See <a href="https://policies.google.com/technologies/cookies">Google Cookie Policy</a>',
                      expiration: '13 months'
                    }
                  ]
                }
              },
              {
                title: 'Analytics',
                description:
                  'We use analytics cookies to understand how users interact with our website through services like Google Analytics and Microsoft Clarity. These cookies may be inherited from the parent domain.',
                linkedCategory: CAT_ANALYTICS,
                ...((): { cookieTable?: CookieTable } => {
                  const analyticsSection = (
                    baseConfig.language?.translations?.['en'] as Translation
                  )?.preferencesModal?.sections?.find(
                    (s: PreferencesModalSection) => s.linkedCategory === CAT_ANALYTICS
                  );
                  return analyticsSection?.cookieTable ? { cookieTable: analyticsSection.cookieTable } : {};
                })()
              },
              {
                title: 'Further information',
                description:
                  'For any queries in relation to the policy on cookies and your choices, please refer to <a href="https://notifycal.com/privacy-policy">privacy policy</a> and <a href="https://policies.google.com/technologies/cookies">Google\'s Cookie Policy</a>.'
              }
            ]
          }
        }
      }
    }
  };

  return config;
}
