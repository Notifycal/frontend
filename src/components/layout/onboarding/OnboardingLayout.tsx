import { Link, Outlet } from '@tanstack/react-router';

import { languageData } from '@common/i18n';
import { useTranslation } from 'react-i18next';

import InternationalizationPicker from '@components/ui/InternationalizationPicker/InternationalizationPicker';

const OnboardingLayout: React.FC = () => {
  const { t, i18n } = useTranslation('onboarding');

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="w-full pt-6 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center">
            <h1 className="text-2xl font-bold text-primary-700 xl:mb-8">{t('header')}</h1>
          </div>
        </div>
      </div>

      <Outlet />

      {/* Footer */}
      <footer className="py-4 bg-white border-t border-gray-200">
        <div className="container mx-auto px-4 flex items-center justify-center gap-6 text-gray-500 text-sm">
          <span>&copy; {t('footer.allRightsReserved', { year: new Date().getFullYear() })}</span>
          <div>
            <InternationalizationPicker
              displayFlagOnly
              data={languageData}
              value={(i18n.languages[0] ?? 'es') as keyof typeof languageData}
              onSelected={async (item) => {
                await i18n.changeLanguage(item.code);
              }}
            />
          </div>
          <Link target="_blank" to="/onboarding/feedback">
            {t('footer.feedbackLink')}
          </Link>
        </div>
      </footer>
    </div>
  );
};
export default OnboardingLayout;
