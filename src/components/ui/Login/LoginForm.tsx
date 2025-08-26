import FlatError from '@components/ui/FlatError/FlatError';
import { getServiceConfig } from '@config/serviceConfig';
import NotifycalIsologo from '@notifycal/shared/assets/logos/notifycal-isologo.svg?react';
import { useAuth, type LoginError } from '@providers/AuthProvider';
import { Link } from '@tanstack/react-router';
import { useEffect, useState, type JSX } from 'react';
import { useTranslation } from 'react-i18next';
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
      <div className="w-[80%] text-primary-500 mx-auto ">
        <NotifycalIsologo className="drop-shadow-md drop-shadow-secondary-100" />
      </div>
      <p className="text-center text-text-secondary pb-4 sm:pb-6">{t('login.welcomeBack')}</p>
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
