import { useTranslation } from 'react-i18next';

import { languageData } from '@common/i18n';
import InternationalizationPicker from '@components/ui/InternationalizationPicker/InternationalizationPicker';

import FooterLinks from './FooterLinks';

interface FooterProps {
  feedback?: {
    link: string;
  };
}

const Footer: React.FC<FooterProps> = ({ feedback }) => {
  const { t, i18n } = useTranslation();

  const links = [
    { title: t('footer.terms'), to: '/terms-and-conditions' },
    { title: t('footer.privacy'), to: '/privacy-policy' }
  ].concat(feedback ? [{ title: t('footer.feedbackLink'), to: feedback.link }] : []);

  return (
    <footer className="py-4 bg-white border-t border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-gray-500 text-sm">
          <span className="text-center md:text-left">
            &copy; {t('footer.allRightsReserved', { year: new Date().getFullYear() })}
          </span>

          <div className="flex flex-col items-center gap-4 md:gap-8 md:flex-row">
            <InternationalizationPicker
              displayFlagOnly
              data={languageData}
              value={(i18n.languages[0] ?? 'es') as keyof typeof languageData}
              onSelected={async (item) => {
                await i18n.changeLanguage(item.code);
              }}
            />
            <FooterLinks links={links} />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
