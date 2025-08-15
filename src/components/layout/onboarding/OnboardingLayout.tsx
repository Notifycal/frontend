import { Outlet } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

const OnboardingLayout: React.FC = () => {
  const { t } = useTranslation('onboarding');

  return (
    <>
      <header className="w-full pt-6 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center">
            <h1 className="text-2xl font-bold text-primary-700 mt-4 xl:mb-8">{t('header')}</h1>
          </div>
        </div>
      </header>
      <Outlet />
    </>
  );
};
export default OnboardingLayout;
