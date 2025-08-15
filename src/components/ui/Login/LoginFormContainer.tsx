import { useEffect, useState, type JSX } from 'react';

import { useTranslation } from 'react-i18next';

import { useAuth, type LoginError } from '@providers/AuthProvider';

import FlatError from '@components/ui/FlatError/FlatError';

import { LoginDecorativeIcon } from './LoginDecorativeIcon';
import { LoginWithGoogleButton } from './LoginWithGoogleButton';

export const LoginFormContainer = (): JSX.Element => {
  const { t } = useTranslation();
  const [lastLoginError, setLastLoginError] = useState<LoginError | null>(null);

  const auth = useAuth();
  const loginErrorMessage = auth.loginError;

  useEffect(() => {
    if (loginErrorMessage) {
      setLastLoginError(loginErrorMessage);
    }
  }, [loginErrorMessage]);

  return (
    <>
      <LoginDecorativeIcon />

      <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('home.signIn')}</h1>
      <p className="text-gray-600 mb-10">{t('home.welcomeBack')}</p>
      <div className="space-y-6">
        <LoginWithGoogleButton />
        {lastLoginError && <FlatError isDismissable={false}>{t(`home.${lastLoginError}`)}</FlatError>}
      </div>
    </>
  );
};
