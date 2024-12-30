import { useEffect, useState } from 'react';

import { Alert, Transition } from '@mantine/core';
import { useTranslation } from 'react-i18next';

import { useAuth, type LoginError } from '@hooks/AuthProvider';

import { getConfigValue } from '@common/utils';

import GoogleIcon from '@components/ui/GoogleIcon/GoogleIcon';

import type { FunctionComponent } from '@common/types';

export const Login = (): FunctionComponent => {
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

  const staticLandingURL = getConfigValue('STATIC_LANDING_URL');

  return (
    <div className="flex h-screen flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-100">
      <div className="sm:mx-auto sm:w-full sm:max-w-[480px]">
        <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
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
          <button
            className="flex w-full items-center justify-center gap-3 mb-5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:ring-transparent"
            onClick={handleLogin}
          >
            {GoogleIcon()}
            <span className="text-sm/6 font-semibold">Google</span>
          </button>

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

          <a className="mt-6 flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
            {t('home.demo')}
          </a>

          <p className="mt-10 text-center text-sm/6 text-gray-500">
            {t('home.wantToKnowMore')}{' '}
            <a className="font-semibold text-indigo-600 hover:text-indigo-500" href={staticLandingURL}>
              {t('home.checkOurSite')}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
