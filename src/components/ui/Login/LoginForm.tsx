import { useEffect, useState, type JSX } from 'react';

import { useTranslation } from 'react-i18next';

import { useAuth, type LoginError } from '@providers/AuthProvider';

import FlatError from '@components/ui/FlatError/FlatError';

import { getServiceConfig } from '@config/serviceConfig';
import { Link } from '@tanstack/react-router';
import { DecorativeIcon } from './DecorativeIcon';
import { LoginWithGoogleButton } from './GoogleLoginButton';

export const LoginForm = (): JSX.Element => {
  const { t } = useTranslation();
  const auth = useAuth();
  const { STATIC_LANDING_URL } = getServiceConfig();

  const [lastLoginError, setLastLoginError] = useState<LoginError | null>(null);
  const loginErrorMessage = auth.loginError;

  useEffect(() => {
    if (loginErrorMessage) {
      setLastLoginError(loginErrorMessage);
    }
  }, [loginErrorMessage]);

  return (
    <>
      <DecorativeIcon />

      <h1 className="text-3xl sm:text-4xl font-bold text-primary text-center pb-2 sm:pb-4">{t('login.signIn')}</h1>
      <p className="text-center text-text-secondary">{t('login.welcomeBack')}</p>
      <div className="mx-auto">
        <LoginWithGoogleButton />
        {lastLoginError && <FlatError isDismissable={false}>{t(`login.${lastLoginError}`)}</FlatError>}
      </div>
      <p className="text-center text-sm/6 text-text-secondary">
        {t('login.wantToKnowMore')}{' '}
        <Link target="_blank" to={STATIC_LANDING_URL}>
          {t('login.checkOurSite')}
        </Link>
      </p>
    </>
  );
};
