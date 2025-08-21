import { Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

import { languageData } from '@common/i18n';
import CookieConsent from '@components/ui/CookieConsent/CookieConsent';
import InternationalizationPicker from '@components/ui/InternationalizationPicker/InternationalizationPicker';
import { showPreferences } from 'vanilla-cookieconsent';

interface FooterProps {
  showFeedbackLink?: boolean;
}

const Footer: React.FC<FooterProps> = ({ showFeedbackLink = false }) => {
  const { t, i18n } = useTranslation();

  const footerLinks = [
    { title: t('footer.terms'), to: '/terms-and-conditions' },
    { title: t('footer.privacy'), to: '/privacy-policy' }
  ].concat(showFeedbackLink ? [{ title: t('footer.feedbackLink'), to: '/onboarding/feedback' }] : []);

  return (
    <footer className="py-4 bg-white border-t border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-gray-500 text-sm">
          <span className="text-center md:text-left">
            &copy; {t('footer.allRightsReserved', { year: new Date().getFullYear() })}
          </span>

          <div className="flex flex-col items-center gap-4 md:gap-8 xs:flex-row">
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

            {footerLinks.map(({ title, to }) => (
              <Link key={to} target="_blank" to={to}>
                {title}
              </Link>
            ))}
            <CookieConsent>
              <Link to="." onClick={showPreferences}>
                {t('footer.cookieSettings')}
              </Link>
            </CookieConsent>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
