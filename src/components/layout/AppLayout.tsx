import { Outlet, useLocation } from '@tanstack/react-router';
import type { FC } from 'react';

import Footer from '@components/ui/Footer/Footer';
import FullPageOverlaySpinner from '@components/ui/FullPageOverlaySpinner/FullPageOverlaySpinner';
import { TwSizeIndicator } from '@components/utils/development-tools/TwSizeIndicator';
import { useAuth } from '@providers/AuthProvider';
import { useTranslation } from 'react-i18next';

const AppLayout: FC = () => {
  const { isAuthenticated, isLoading, isReloading } = useAuth();
  const { t } = useTranslation();

  const location = useLocation();
  const isUnderOnboarding = location.pathname.includes('/onboarding');

  const feedbackLink = isAuthenticated ? (isUnderOnboarding ? '/onboarding/feedback' : '/feedback') : undefined;
  const feedbackAttribute = feedbackLink ? { feedback: { link: feedbackLink } } : {};

  return (
    <>
      <title>{t('pageTitle')}</title>
      <TwSizeIndicator />
      <div className="min-h-[100dvh] flex flex-col">
        <div className="flex-grow bg-neutral-50 flex flex-col">
          <Outlet />
        </div>
        <Footer {...feedbackAttribute} />
      </div>
      {(isLoading || isReloading) && <FullPageOverlaySpinner />}
    </>
  );
};

export default AppLayout;
