import { Alert } from '@mantine/core';
import { type CodeResponse } from '@react-oauth/google';
import { useRouter } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

import { GOOGLE_OAUTH_SCOPES } from '../auth/google';

import { useAuth } from '../hooks/AuthProvider';
import usePromisifiedGoogleLogin from '../hooks/usePromisifiedGoogleLogin';

import { sleep } from '../common/utils';
import { Route } from '../routes/index';

import type { ReactElement } from 'react';
import type { FunctionComponent } from '../common/types';

const GoogleSVG = (): ReactElement<SVGElement> => {
  return (
    <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24">
      <path
        d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z"
        fill="#EA4335"
      />
      <path
        d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z"
        fill="#4285F4"
      />
      <path
        d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z"
        fill="#FBBC05"
      />
      <path
        d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.2654 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z"
        fill="#34A853"
      />
    </svg>
  );
};

export const Login = (): FunctionComponent => {
  const { t, i18n } = useTranslation();

  // TODO: Add language toggle/picker
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onTranslateButtonClick = async (): Promise<void> => {
    if (i18n.resolvedLanguage === 'en') {
      await i18n.changeLanguage('es');
    } else {
      await i18n.changeLanguage('en');
    }
  };

  const auth = useAuth();
  const router = useRouter();
  const navigate = Route.useNavigate();
  const search = Route.useSearch();

  const loginErrorMessage = auth.loginError;

  const handleGoogleLoginSuccess = async (codeResponse: CodeResponse): Promise<void> => {
    await auth.login(codeResponse);

    // This invalidate has to do with the fact that the router has a context (AuthContext) not
    // with the navigation itself.
    await router.invalidate();

    // hack
    await sleep(1);

    await navigate({ to: search.redirect || '/dashboard' });
  };

  const googleLogin = usePromisifiedGoogleLogin({
    flow: 'auth-code',
    scope: GOOGLE_OAUTH_SCOPES.join(' ')
  })

  const handleGoogleLogin = async () => {
    googleLogin()
      .then((codeResponse) => {
        handleGoogleLoginSuccess(codeResponse)
      })
      .catch((errorResponse) => {
        console.log('Login failed:', errorResponse);
      });
  }

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
            onClick={handleGoogleLogin}
          >
            {GoogleSVG()}
            <span className="text-sm/6 font-semibold">Google</span>
          </button>

          {loginErrorMessage && (
            <Alert className="rounded-md" color="red" variant="light">
              <p className="text-red-600">{t(`home.${loginErrorMessage}`)}</p>
            </Alert>
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
            <a className="font-semibold text-indigo-600 hover:text-indigo-500" href="https://dev.notifycal.com/">
              {t('home.checkOurSite')}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
