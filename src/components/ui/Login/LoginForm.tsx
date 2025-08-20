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

      <h1 className="text-4xl font-bold text-primary mb-4 text-center lg:text-left">{t('home.signIn')}</h1>
      <p className="text-text-secondary mb-10">{t('home.welcomeBack')}</p>
      <div className="space-y-6">
        <LoginWithGoogleButton />
        {lastLoginError && <FlatError isDismissable={false}>{t(`home.${lastLoginError}`)}</FlatError>}
      </div>
      <p className="mt-10 text-center text-sm/6 text-text-secondary">
        {t('home.wantToKnowMore')}{' '}
        <Link target="_blank" to={STATIC_LANDING_URL}>
          {t('home.checkOurSite')}
        </Link>
      </p>
    </>
  );
};
