import FooterLink from './FooterLink';

interface FooterLinkData {
  title: string;
  to: string;
}

interface FooterLinksGroupProps {
  links: Array<FooterLinkData>;
  className?: string;
}

const FooterLinksGroup: React.FC<FooterLinksGroupProps> = ({ className, links }) => (
  <div className={className}>
    {links.map(({ title, to }) => (
      <FooterLink key={to} target="_blank" to={to}>
        {title}
      </FooterLink>
    ))}
  </div>
);

export default FooterLinksGroup;
