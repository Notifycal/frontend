import { useTranslation } from 'react-i18next';
import { showPreferences } from 'vanilla-cookieconsent';

import CookieConsent from '@components/ui/CookieConsent/CookieConsent';
import FooterLink from './FooterLink';

const CookieSettingsLink: React.FC = () => {
  const { t } = useTranslation();

  return (
    <CookieConsent>
      <FooterLink to="." onClick={showPreferences}>
        {t('footer.cookieSettings')}
      </FooterLink>
    </CookieConsent>
  );
};

export default CookieSettingsLink;