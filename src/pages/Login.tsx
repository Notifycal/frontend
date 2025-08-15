import { useEffect, useState, type JSX } from 'react';

import { Alert, Button, Transition } from '@mantine/core';
import { useTranslation } from 'react-i18next';

import { useAuth, type LoginError } from '@providers/AuthProvider';

import GoogleIcon from '@components/ui/GoogleIcon/GoogleIcon';

export const Login = (): JSX.Element => {
  const { t } = useTranslation();
  // const { t, i18n } = useTranslation();

  // TODO: Add language toggle/picker

  // const onTranslateButtonClick = async (): Promise<void> => {
  //   if (i18n.resolvedLanguage === 'en') {
  //     await i18n.changeLanguage('es');
  //   } else {
  //     await i18n.changeLanguage('en');
  //   }
  // };

  const [lastLoginError, setLastLoginError] = useState<LoginError | null>(null);

  const auth = useAuth();
  const loginErrorMessage = auth.loginError;

  useEffect(() => {
    if (loginErrorMessage) {
      setLastLoginError(loginErrorMessage);
    }
  }, [loginErrorMessage]);

  const handleLogin = auth.login;

  // const { STATIC_LANDING_URL } = useServiceConfig();

  return (
    <div className="min-h-[calc(100vh-120px)] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-[480px]">
        <div className="bg-white px-6 py-12 shadow-sm sm:rounded-lg sm:px-12">
          <div className="sm:mx-auto sm:w-full sm:max-w-md mb-6">
            <img
              alt="Your Company"
              className="mx-auto h-10 w-auto"
              src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600"
            />
            <h2 className="mt-6 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
              {t('home.signInToYourAccount')}
            </h2>
          </div>
          <Button
            className="w-full rounded-md bg-white hover:bg-gray-50 text-gray-900 ring-1 ring-inset ring-gray-300 focus-visible:ring-transparent shadow-xs"
            onClick={handleLogin}
          >
            <div className="flex gap-3 items-center justify-center">
              {GoogleIcon()}
              <span className="text-sm font-semibold">Google</span>
            </div>
          </Button>
          {lastLoginError && (
            <Transition duration={300} mounted={!!loginErrorMessage} timingFunction="ease" transition="fade">
              {(styles) => (
                <Alert className="rounded-md" color="red" style={styles} variant="light">
                  <p className="text-red-600">{t(`home.${lastLoginError}`)}</p>
                </Alert>
              )}
            </Transition>
          )}

          <div className="relative mt-5">
            <div aria-hidden="true" className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm/6 font-medium">
              <span className="bg-white px-6 text-gray-900">{t('home.orCheckOurDemo')} </span>
            </div>
          </div>

          <Button
            className="w-full mt-6 rounded-md font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 shadow-xs"
            component="a"
            href="/feedback"
          >
            {t('home.demo')}
          </Button>

          <p className="mt-10 text-center text-sm/6 text-gray-500">
            {t('home.wantToKnowMore')} <a href="#">{t('home.checkOurSite')}</a>
          </p>
        </div>
      </div>
    </div>
  );
};
