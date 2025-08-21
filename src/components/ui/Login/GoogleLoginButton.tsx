import type { JSX } from 'react';

import { Button, Tooltip } from '@mantine/core';
import { useTranslation } from 'react-i18next';

import { useAuth } from '@providers/AuthProvider';
import { useCookieConsent } from '@hooks/useCookieConsent';

import GoogleIcon from '@components/ui/GoogleIcon/GoogleIcon';

export const LoginWithGoogleButton = (): JSX.Element => {
  const { t } = useTranslation();
  const auth = useAuth();
  const { hasSecurityConsent } = useCookieConsent();
  const handleLogin = auth.login;

  const button = (
    <Button
      className="w-full rounded-md bg-white hover:bg-gray-50 text-primary ring-1 ring-inset ring-gray-300 focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 shadow-xs py-2.5 px-3 disabled:opacity-50 disabled:cursor-not-allowed"
      disabled={!hasSecurityConsent}
      size="md"
      variant="default"
      onClick={handleLogin}
    >
      <div className="flex gap-3 items-center justify-center">
        {GoogleIcon()}
        <span className="text-md font-semibold">{t('home.signInWithGoogle')}</span>
      </div>
    </Button>
  );

  if (!hasSecurityConsent) {
    return (
      <Tooltip
        multiline
        label={t('home.loginErrorNoConsent')}
        position="bottom"
        w={300}
      >
        {button}
      </Tooltip>
    );
  }

  return button;
};
