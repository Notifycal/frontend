import { Outlet } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

import NotifycalIsologo from '@notifycal/shared/assets/logos/notifycal-isologo.svg?react';

const OnboardingLayout: React.FC = () => {
  const { t } = useTranslation('onboarding');

  return (
    <>
      <header className="w-full bg-white">
        <div className="container mx-auto py-8">
          <div className="flex flex-col items-center">
            <NotifycalIsologo aria-label={t('header')} className="text-primary-600" style={{ height: 50 }} />
          </div>
        </div>
      </header>
      <Outlet />
    </>
  );
};
export default OnboardingLayout;
