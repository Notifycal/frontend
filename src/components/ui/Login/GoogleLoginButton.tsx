import type { JSX } from 'react';

import { Button } from '@mantine/core';
import { useTranslation } from 'react-i18next';

import { useAuth } from '@providers/AuthProvider';

import GoogleIcon from '@components/ui/GoogleIcon/GoogleIcon';

export const LoginWithGoogleButton = (): JSX.Element => {
  const { t } = useTranslation();
  const auth = useAuth();
  const handleLogin = auth.login;

  return (
    <Button
      className="rounded-md bg-white hover:bg-gray-50 text-primary ring-1 ring-inset ring-gray-300 focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 shadow-xs py-2.5 px-3"
      size="md"
      variant="default"
      onClick={handleLogin}
    >
      <div className="flex gap-3 items-center justify-center">
        {GoogleIcon()}
        <span className="text-sm font-semibold">{t('login.signInWithGoogle')}</span>
      </div>
    </Button>
  );
};
