import { Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

import { languageData } from '@common/i18n';
import InternationalizationPicker from '@components/ui/InternationalizationPicker/InternationalizationPicker';

interface FooterProps {
  showFeedbackLink?: boolean;
}

const Footer: React.FC<FooterProps> = ({ showFeedbackLink = false }) => {
  const { t, i18n } = useTranslation();

  return (
    <footer className="py-4 bg-white border-t border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 text-gray-500 text-sm">
          <span>&copy; {t('footer.allRightsReserved', { year: new Date().getFullYear() })}</span>

          <div className="flex items-center gap-4 sm:gap-6">
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

            <Link className="hover:underline" target="_blank" to="/terms-and-conditions">
              {t('footer.terms')}
            </Link>

            <Link className="hover:underline" target="_blank" to="/privacy-policy">
              {t('footer.privacy')}
            </Link>

            {showFeedbackLink && (
              <Link className="hover:underline" target="_blank" to="/onboarding/feedback">
                {t('footer.feedbackLink')}
              </Link>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
