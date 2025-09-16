import CollapsibleFooterLinks from './CollapsibleFooterLinks';
import CookieSettingsLink from './CookieSettingsLink';
import FooterLinksGroup from './FooterLinksGroup';

interface FooterLinkData {
  title: string;
  to: string;
}

interface FooterLinksProps {
  links: Array<FooterLinkData>;
}

const FooterLinks: React.FC<FooterLinksProps> = ({ links }) => (
  <>
    <CookieSettingsLink />

    <div className="flex flex-col items-center gap-3 md:hidden">
      {links.length > 0 && (
        <div className="flex items-center gap-2 text-gray-500 text-sm">
          <span>|</span>
          <CollapsibleFooterLinks links={links} />
        </div>
      )}
    </div>

    <div className="hidden md:flex items-center gap-8">
      <FooterLinksGroup className="flex items-center gap-8" links={links} />
    </div>
  </>
);

export default FooterLinks;
