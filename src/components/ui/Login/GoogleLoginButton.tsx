import { useState, type JSX } from 'react';

import { Button } from '@mantine/core';
import { useTranslation } from 'react-i18next';

import { useAuth } from '@providers/AuthProvider';
import { useCookieConsent } from '@providers/CookieConsentProvider';

import FlatError from '@components/ui/FlatError/FlatError';
import GoogleIcon from '@components/ui/GoogleIcon/GoogleIcon';

export const LoginWithGoogleButton = (): JSX.Element => {
  const { t } = useTranslation();
  const auth = useAuth();
  const { hasSecurityConsent } = useCookieConsent();
  const [showConsentError, setShowConsentError] = useState(false);

  const handleClick = (): void => {
    if (!hasSecurityConsent) {
      setShowConsentError(true);
      return;
    }
    void auth.login();
  };

  const button = (
    <Button
      className="w-full rounded-md bg-white hover:bg-gray-50 text-primary ring-1 ring-inset ring-gray-300 focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 shadow-xs py-2.5 px-3 disabled:opacity-50 disabled:cursor-not-allowed"
      size="md"
      variant="default"
      onClick={handleClick}
    >
      <div className="flex gap-3 items-center justify-center">
        {GoogleIcon()}
        <span className="text-md font-semibold">{t('home.signInWithGoogle')}</span>
      </div>
    </Button>
  );

  return (
    <>
      {button}
      {showConsentError && (
        <FlatError
          isDismissable
          title="Information"
          onErrorClose={() => {
            setShowConsentError(false);
          }}
        >
          {t('home.loginErrorNoConsent')}
        </FlatError>
      )}
    </>
  );
};
