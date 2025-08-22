import type { LanguageCode } from '@notifycal/shared/types';
import {
  CAT_ANALYTICS,
  CAT_NECESSARY,
  cookieConsentConfig as commonCookieConsentConfig,
  SERVICE_SECURITY_STORAGE
} from '@notifycal/shared/cookies';
import type { CookieConsentConfig, Translation } from 'vanilla-cookieconsent';

type PreferencesModalSection = NonNullable<NonNullable<Translation['preferencesModal']>['sections']>[0];
type CookieTable = NonNullable<PreferencesModalSection['cookieTable']>;

export function cookieConsentConfig(language: LanguageCode): CookieConsentConfig {
  const baseConfig = commonCookieConsentConfig(language);

  const config: CookieConsentConfig = {
    ...baseConfig,
    categories: {
      ...baseConfig.categories,
      [CAT_NECESSARY]: {
        enabled: true,
        readOnly: true,
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
          ]
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
      default: language,
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
                linkedCategory: CAT_NECESSARY,
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
        },
        es: {
          ...(baseConfig.language?.translations?.['es'] as Translation),
          preferencesModal: {
            ...(baseConfig.language?.translations?.['es'] as Translation)?.preferencesModal,
            sections: [
              {
                title: 'Uso de cookies',
                description:
                  'Utilizamos cookies para asegurar las funcionalidades básicas del sitio web y mejorar tu experiencia online.'
              },
              {
                title: 'Cookies estrictamente necesarias',
                description:
                  'Estas cookies son esenciales para el correcto funcionamiento del sitio web, incluyendo la autenticación de usuarios.',
                linkedCategory: CAT_NECESSARY,
                cookieTable: {
                  headers: {
                    name: 'Nombre',
                    domain: 'Servicio',
                    description: 'Descripción',
                    expiration: 'Caducidad'
                  },
                  body: [
                    {
                      name: 'SID',
                      domain: 'Autenticación de Google',
                      description:
                        'Contiene registros firmados digitalmente y cifrados del ID de la cuenta de Google del usuario y la hora de inicio de sesión más reciente. La combinación de las cookies SID y HSID permite a Google bloquear muchos tipos de ataques, como intentos de robar el contenido de formularios enviados en los servicios de Google. Ver <a href="https://policies.google.com/technologies/cookies">Política de Cookies de Google</a>',
                      expiration: '2 años'
                    },
                    {
                      name: 'HSID',
                      domain: 'Autenticación de Google',
                      description:
                        'Contiene registros firmados digitalmente y cifrados del ID de la cuenta de Google del usuario y la hora de inicio de sesión más reciente. Funciona con la cookie SID para autenticar usuarios y bloquear muchos tipos de ataques. Ver <a href="https://policies.google.com/technologies/cookies">Política de Cookies de Google</a>',
                      expiration: '2 años'
                    },
                    {
                      name: 'SSID',
                      domain: 'Autenticación de Google',
                      description:
                        'Cookie de seguridad similar a SID y HSID utilizada para propósitos de autenticación. Ver <a href="https://policies.google.com/technologies/cookies">Política de Cookies de Google</a>',
                      expiration: '2 años'
                    },
                    {
                      name: 'APISID',
                      domain: 'Autenticación de Google',
                      description:
                        'Utilizada al acceder a las API de Google y para propósitos de autenticación. Ver <a href="https://policies.google.com/technologies/cookies">Política de Cookies de Google</a>',
                      expiration: '2 años'
                    },
                    {
                      name: 'SAPISID',
                      domain: 'Autenticación de Google',
                      description:
                        'Utilizada para autenticación y para reproducir videos de YouTube insertados en otros sitios web. Ver <a href="https://policies.google.com/technologies/cookies">Política de Cookies de Google</a>',
                      expiration: '2 años'
                    },
                    {
                      name: '__Secure-1PSID',
                      domain: 'Autenticación de Google',
                      description:
                        'Variante segura de las cookies de autenticación para mayor seguridad. Ver <a href="https://policies.google.com/technologies/cookies">Política de Cookies de Google</a>',
                      expiration: '2 años'
                    },
                    {
                      name: '__Secure-3PSID',
                      domain: 'Autenticación de Google',
                      description:
                        'Cookie segura de autenticación de terceros para verificación entre dominios. Ver <a href="https://policies.google.com/technologies/cookies">Política de Cookies de Google</a>',
                      expiration: '2 años'
                    },
                    {
                      name: '__Secure-1PAPISID',
                      domain: 'Autenticación de Google',
                      description:
                        'Variante segura de cookie de autenticación para mayor protección. Ver <a href="https://policies.google.com/technologies/cookies">Política de Cookies de Google</a>',
                      expiration: '2 años'
                    },
                    {
                      name: '__Secure-3PAPISID',
                      domain: 'Autenticación de Google',
                      description:
                        'Variante segura de cookie de autenticación de terceros. Ver <a href="https://policies.google.com/technologies/cookies">Política de Cookies de Google</a>',
                      expiration: '2 años'
                    },
                    {
                      name: 'NID',
                      domain: 'Google',
                      description:
                        'Utilizada para recordar tus preferencias y otra información, como tu idioma preferido, cuántos resultados prefieres que se muestren en una página de resultados de búsqueda y si quieres tener activado el filtro SafeSearch de Google. Ver <a href="https://policies.google.com/technologies/cookies">Política de Cookies de Google</a>',
                      expiration: '6 meses'
                    },
                    {
                      name: '_Secure-ENID',
                      domain: 'Google',
                      description:
                        'Versión mejorada de la cookie NID utilizada para recordar tus preferencias y otra información con seguridad adicional. Ver <a href="https://policies.google.com/technologies/cookies">Política de Cookies de Google</a>',
                      expiration: '13 meses'
                    },
                    {
                      name: 'AEC',
                      domain: 'Google',
                      description:
                        'Utilizada para detectar spam, fraude y abuso para ayudar a asegurar que a los anunciantes no se les cobre incorrectamente por impresiones fraudulentas o de otro modo inválidas o interacciones con anuncios. Ver <a href="https://policies.google.com/technologies/cookies">Política de Cookies de Google</a>',
                      expiration: '6 meses'
                    },
                    {
                      name: '__Secure-YEC',
                      domain: 'Google',
                      description:
                        'Utilizada para detectar spam, fraude y abuso para ayudar a asegurar que los creadores de YouTube en el Programa de Partners de YouTube sean remunerados de manera justa. Ver <a href="https://policies.google.com/technologies/cookies">Política de Cookies de Google</a>',
                      expiration: '13 meses'
                    },
                    {
                      name: 'SOCS',
                      domain: 'Google',
                      description:
                        'Almacena el estado del usuario respecto a sus elecciones de cookies. Ver <a href="https://policies.google.com/technologies/cookies">Política de Cookies de Google</a>',
                      expiration: '13 meses'
                    }
                  ]
                }
              },
              {
                title: 'Analíticas',
                description:
                  'Utilizamos cookies de analíticas para entender cómo los usuarios interactúan con nuestro sitio web a través de servicios como Google Analytics y Microsoft Clarity. Estas cookies pueden heredarse del dominio principal.',
                linkedCategory: CAT_ANALYTICS,
                ...((): { cookieTable?: CookieTable } => {
                  const analyticsSection = (
                    baseConfig.language?.translations?.['es'] as Translation
                  )?.preferencesModal?.sections?.find(
                    (s: PreferencesModalSection) => s.linkedCategory === CAT_ANALYTICS
                  );
                  return analyticsSection?.cookieTable ? { cookieTable: analyticsSection.cookieTable } : {};
                })()
              },
              {
                title: 'Información adicional',
                description:
                  'Para cualquier consulta en relación con la política de cookies y tus opciones, consulta nuestra <a href="https://notifycal.com/privacy-policy">política de privacidad</a> y la <a href="https://policies.google.com/technologies/cookies">Política de Cookies de Google</a>.'
              }
            ]
          }
        },
        ca: {
          ...(baseConfig.language?.translations?.['ca'] as Translation),
          preferencesModal: {
            ...(baseConfig.language?.translations?.['ca'] as Translation)?.preferencesModal,
            sections: [
              {
                title: 'Ús de cookies',
                description:
                  'Utilitzem cookies per assegurar les funcionalitats bàsiques del lloc web i millorar la teva experiència en línia.'
              },
              {
                title: 'Cookies estrictament necessàries',
                description:
                  "Aquestes cookies són essencials per al funcionament correcte del lloc web, incloent l'autenticació d'usuaris.",
                linkedCategory: CAT_NECESSARY,
                cookieTable: {
                  headers: {
                    name: 'Nom',
                    domain: 'Servei',
                    description: 'Descripció',
                    expiration: 'Caducitat'
                  },
                  body: [
                    {
                      name: 'SID',
                      domain: 'Autenticació de Google',
                      description:
                        "Conté registres signats digitalment i xifrats de l'ID del compte de Google de l'usuari i l'hora d'inici de sessió més recent. La combinació de les cookies SID i HSID permet a Google bloquejar molts tipus d'atacs, com ara intents de robar el contingut de formularis enviats als serveis de Google. Veure <a href=\"https://policies.google.com/technologies/cookies\">Política de Cookies de Google</a>",
                      expiration: '2 anys'
                    },
                    {
                      name: 'HSID',
                      domain: 'Autenticació de Google',
                      description:
                        "Conté registres signats digitalment i xifrats de l'ID del compte de Google de l'usuari i l'hora d'inici de sessió més recent. Funciona amb la cookie SID per autenticar usuaris i bloquejar molts tipus d'atacs. Veure <a href=\"https://policies.google.com/technologies/cookies\">Política de Cookies de Google</a>",
                      expiration: '2 anys'
                    },
                    {
                      name: 'SSID',
                      domain: 'Autenticació de Google',
                      description:
                        'Cookie de seguretat similar a SID i HSID utilitzada per propòsits d\'autenticació. Veure <a href="https://policies.google.com/technologies/cookies">Política de Cookies de Google</a>',
                      expiration: '2 anys'
                    },
                    {
                      name: 'APISID',
                      domain: 'Autenticació de Google',
                      description:
                        'Utilitzada quan s\'accedeix a les API de Google i per propòsits d\'autenticació. Veure <a href="https://policies.google.com/technologies/cookies">Política de Cookies de Google</a>',
                      expiration: '2 anys'
                    },
                    {
                      name: 'SAPISID',
                      domain: 'Autenticació de Google',
                      description:
                        'Utilitzada per autenticació i per reproduir vídeos de YouTube inserits en altres llocs web. Veure <a href="https://policies.google.com/technologies/cookies">Política de Cookies de Google</a>',
                      expiration: '2 anys'
                    },
                    {
                      name: '__Secure-1PSID',
                      domain: 'Autenticació de Google',
                      description:
                        'Variant segura de les cookies d\'autenticació per major seguretat. Veure <a href="https://policies.google.com/technologies/cookies">Política de Cookies de Google</a>',
                      expiration: '2 anys'
                    },
                    {
                      name: '__Secure-3PSID',
                      domain: 'Autenticació de Google',
                      description:
                        'Cookie segura d\'autenticació de tercers per verificació entre dominis. Veure <a href="https://policies.google.com/technologies/cookies">Política de Cookies de Google</a>',
                      expiration: '2 anys'
                    },
                    {
                      name: '__Secure-1PAPISID',
                      domain: 'Autenticació de Google',
                      description:
                        'Variant segura de cookie d\'autenticació per major protecció. Veure <a href="https://policies.google.com/technologies/cookies">Política de Cookies de Google</a>',
                      expiration: '2 anys'
                    },
                    {
                      name: '__Secure-3PAPISID',
                      domain: 'Autenticació de Google',
                      description:
                        'Variant segura de cookie d\'autenticació de tercers. Veure <a href="https://policies.google.com/technologies/cookies">Política de Cookies de Google</a>',
                      expiration: '2 anys'
                    },
                    {
                      name: 'NID',
                      domain: 'Google',
                      description:
                        'Utilitzada per recordar les teves preferències i altra informació, com el teu idioma preferit, quants resultats prefereixes que es mostrin en una pàgina de resultats de cerca i si vols tenir activat el filtre SafeSearch de Google. Veure <a href="https://policies.google.com/technologies/cookies">Política de Cookies de Google</a>',
                      expiration: '6 mesos'
                    },
                    {
                      name: '_Secure-ENID',
                      domain: 'Google',
                      description:
                        'Versió millorada de la cookie NID utilitzada per recordar les teves preferències i altra informació amb seguretat addicional. Veure <a href="https://policies.google.com/technologies/cookies">Política de Cookies de Google</a>',
                      expiration: '13 mesos'
                    },
                    {
                      name: 'AEC',
                      domain: 'Google',
                      description:
                        'Utilitzada per detectar spam, frau i abús per ajudar a assegurar que els anunciants no siguin cobrats incorrectament per impressions fraudulentes o altrament invàlides o interaccions amb anuncis. Veure <a href="https://policies.google.com/technologies/cookies">Política de Cookies de Google</a>',
                      expiration: '6 mesos'
                    },
                    {
                      name: '__Secure-YEC',
                      domain: 'Google',
                      description:
                        'Utilitzada per detectar spam, frau i abús per ajudar a assegurar que els creadors de YouTube en el Programa de Socis de YouTube siguin remunerats de manera justa. Veure <a href="https://policies.google.com/technologies/cookies">Política de Cookies de Google</a>',
                      expiration: '13 mesos'
                    },
                    {
                      name: 'SOCS',
                      domain: 'Google',
                      description:
                        'Emmagatzema l\'estat de l\'usuari respecte a les seves eleccions de cookies. Veure <a href="https://policies.google.com/technologies/cookies">Política de Cookies de Google</a>',
                      expiration: '13 mesos'
                    }
                  ]
                }
              },
              {
                title: 'Analítiques',
                description:
                  "Utilitzem cookies d'analítiques per entendre com els usuaris interactuen amb el nostre lloc web a través de serveis com Google Analytics i Microsoft Clarity. Aquestes cookies poden heretar-se del domini principal.",
                linkedCategory: CAT_ANALYTICS,
                ...((): { cookieTable?: CookieTable } => {
                  const analyticsSection = (
                    baseConfig.language?.translations?.['ca'] as Translation
                  )?.preferencesModal?.sections?.find(
                    (s: PreferencesModalSection) => s.linkedCategory === CAT_ANALYTICS
                  );
                  return analyticsSection?.cookieTable ? { cookieTable: analyticsSection.cookieTable } : {};
                })()
              },
              {
                title: 'Informació addicional',
                description:
                  'Per a qualsevol consulta en relació amb la política de cookies i les teves opcions, consulta la nostra <a href="https://notifycal.com/privacy-policy">política de privacitat</a> i la <a href="https://policies.google.com/technologies/cookies">Política de Cookies de Google</a>.'
              }
            ]
          }
        }
      }
    }
  };

  return config;
}
