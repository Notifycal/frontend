import { Link } from '@tanstack/react-router';
import type { JSX } from 'react';

interface NavigationMenuProps {
  className: string;
  activeClassName: string;
}

const NavigationMenu = ({ className, activeClassName }: NavigationMenuProps): JSX.Element => {
  const navigationItems = [
    { name: 'Dashboard', to: '/dashboard' },
    { name: 'Feedback', to: '/feedback' },
    { name: 'FAQ', to: '/faq' }
  ];

  return (
    <>
      {navigationItems.map((item) => (
        <Link key={item.to} activeProps={{ className: activeClassName }} inactiveProps={{ className }} to={item.to}>
          {item.name}
        </Link>
      ))}
    </>
  );
};

export default NavigationMenu;
