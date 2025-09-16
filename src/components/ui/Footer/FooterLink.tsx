import { Link } from '@tanstack/react-router';

interface FooterLinkProps {
  to: string;
  target?: string;
  onClick?: () => void;
  children: React.ReactNode;
}

const FooterLink: React.FC<FooterLinkProps> = ({ children, onClick, target, to }) => (
  <Link
    className="hover:text-gray-700 transition-colors"
    to={to}
    {...(target && { target })}
    onClick={onClick}
  >
    {children}
  </Link>
);

export default FooterLink;