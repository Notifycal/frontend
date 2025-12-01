import FlatError from '@components/ui/FlatError/FlatError';
import { getServiceConfig } from '@config/serviceConfig';
import NotifycalIsologo from '@notifycal/shared/assets/logos/notifycal-isologo.svg?react';
import { useAuth } from '@providers/AuthProvider';
import { Link } from '@tanstack/react-router';
import type { JSX } from 'react';
import { useTranslation } from 'react-i18next';
import { LoginWithGoogleButton } from './GoogleLoginButton';

export const LoginForm = (): JSX.Element => {
  const { t } = useTranslation();
  const auth = useAuth();
  const { STATIC_LANDING_URL } = getServiceConfig();

  const lastLoginError = auth.loginError;

  return (
    <>
      <div className="w-full max-w-84 px-4 text-primary-600 mx-auto">
        <NotifycalIsologo className="w-full h-auto drop-shadow-md drop-shadow-secondary-100" />
      </div>
      <p className="text-center text-text-secondary pb-4 sm:pb-6">{t('login.welcomeBack')}</p>
      <div className="mx-auto">
        <LoginWithGoogleButton />
      </div>
      {lastLoginError && (
        <div className="min-h-20 my-2">
          <FlatError isDismissable={false}>{t(`login.${lastLoginError}`)}</FlatError>
        </div>
      )}
      <p className="text-center text-sm/6 text-text-secondary">
        {t('login.wantToKnowMore')}{' '}
        <Link target="_blank" to={STATIC_LANDING_URL}>
          {t('login.checkOurSite')}
        </Link>
      </p>
    </>
  );
};
