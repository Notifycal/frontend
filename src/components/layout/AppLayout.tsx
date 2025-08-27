import { Outlet } from '@tanstack/react-router';
import type { FC } from 'react';

import Footer from '@components/ui/Footer/Footer';
import { useAuth } from '@providers/AuthProvider';
import { TwSizeIndicator } from '@components/utils/development-tools/TwSizeIndicator';
import { useTranslation } from 'react-i18next';
import FullPageOverlaySpinner from '@components/ui/FullPageOverlaySpinner/FullPageOverlaySpinner';

const AppLayout: FC = () => {
  const { isAuthenticated, isLoading, isReloading } = useAuth();
  const { t } = useTranslation();

  return (
    <>
      <title>{t('pageTitle')}</title>
      <TwSizeIndicator />
      <div className="min-h-[100dvh] flex flex-col">
        <div className="flex-grow bg-neutral-50 flex flex-col">
          <Outlet />
        </div>
        <Footer showFeedbackLink={isAuthenticated} />
      </div>
      {(isLoading || isReloading) && <FullPageOverlaySpinner />}
    </>
  );
};

export default AppLayout;
