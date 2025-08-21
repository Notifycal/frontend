import { Outlet } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

const OnboardingLayout: React.FC = () => {
  const { t } = useTranslation('onboarding');

  return (
    <>
      <header className="w-full bg-white">
        <div className="container mx-auto py-8">
          <div className="flex flex-col items-center">
            <h1 className="text-2xl font-bold text-primary-700 text-center">{t('header')}</h1>
          </div>
        </div>
      </header>
      <Outlet />
    </>
  );
};
export default OnboardingLayout;
