import { Menu, type MantineColor } from '@mantine/core';
import NotifycalIsologo from '@notifycal/shared/assets/logos/notifycal-isologo.svg?react';
import type { IdpName, User } from '@notifycal/shared/types';
import { useAuth } from '@providers/AuthProvider';
import {
  IconLogout2,
  IconMessageQuestion,
  IconSettings,
  IconUserFilled,
  type Icon,
  type IconProps
} from '@tabler/icons-react';
import { Link } from '@tanstack/react-router';
import type { ForwardRefExoticComponent, JSX, RefAttributes } from 'react';
import { useTranslation } from 'react-i18next';
import NavigationDrawer from '../NavigationDrawer/NavigationDrawer';
import NavigationMenu from '../NavigationMenu/NavigationMenu';

interface UserNavigationItem {
  name: string;
  icon: ForwardRefExoticComponent<IconProps & RefAttributes<Icon>>;
  color: MantineColor;
  onClick?: () => void;
  href?: string;
}

interface UserProps {
  user: User<IdpName>;
}

export default function Navigation(props: UserProps): JSX.Element {
  const auth = useAuth();
  const onLogoutHandler = auth.logout;
  const { t } = useTranslation();

  const userNavigation: Array<UserNavigationItem> = [
    {
      name: t('navigation.configuration'),
      href: '/onboarding?edit=true',
      icon: IconSettings,
      color: 'dark'
    },
    {
      name: t('navigation.faq'),
      href: '/faq',
      color: 'dark',
      icon: IconMessageQuestion
    },
    {
      name: t('navigation.signOut'),
      onClick: onLogoutHandler,
      color: 'red',
      icon: IconLogout2
    }
  ];

  const { user } = props;

  return (
    <nav className="border-b border-secondary-500/25 bg-secondary-500 lg:border-none">
      <div className="mx-auto px-2 sm:px-4 lg:px-8">
        <div className="relative flex h-[103px] items-stretch justify-between lg:border-b lg:border-primary-400/25">
          <div className="flex items-center px-2 lg:px-0">
            <div className="shrink-0">
              <Link to="/dashboard">
                <NotifycalIsologo
                  className="text-primary-500 h-10 transition-all duration-300 hover:scale-105 drop-shadow-md hover:drop-shadow-xl drop-shadow-primary-900 hover:drop-shadow-primary-900"
                  style={{ height: 55 }}
                />
              </Link>
            </div>
            <div className="hidden lg:ml-10 lg:block">
              <div className="flex space-x-4">
                <NavigationMenu
                  activeClassName="relative after:absolute cursor-default px-3 py-2 text-lg font-medium text-white hover:no-underline transition-all duration-300 after:right-2 after:bottom-0 after:left-2 after:h-0.5 after:bg-gradient-to-tl after:content-['']"
                  className="relative after:absolute px-3 py-2 text-lg font-medium text-white hover:no-underline transition-all duration-300 hover:scale-105 hover:after:right-2 hover:after:bottom-0 hover:after:left-2 hover:after:h-1 hover:after:bg-gradient-accent1 hover:after:content-['']"
                />
              </div>
            </div>
          </div>

          <div className="hidden lg:ml-4 lg:flex flex-col justify-center">
            {user && (
              <Menu position="bottom-end" shadow="md" width={200}>
                <Menu.Target>
                  <div className="transition-all duration-300 transparent hover:bg-gradient-accent1 p-0.5 rounded-2xl cursor-pointer">
                    <button
                      className="rounded-2xl group flex items-center justify-center gap-2 px-4 py-2 bg-secondary-500 cursor-pointer"
                      type="button"
                    >
                      <div className="text-right">
                        <div className="text-md font-semibold text-primary-300">{user.config?.business.name}</div>
                        <div className="text-sm font-medium text-primary-50">{user.email}</div>
                      </div>
                      <div className="size-8 relative flex rounded-full bg-primary-600 text-sm text-white focus:outline-hidden focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-600">
                        <span className="absolute -inset-1.5" />
                        <span className="sr-only">{t('navigation.openMainMenu')}</span>
                        <IconUserFilled className="size-8 rounded-full border-primary-500  border-1 p-0.5" />
                      </div>
                    </button>
                  </div>
                </Menu.Target>

                <Menu.Dropdown>
                  {userNavigation.map(({ name, href, onClick, color, icon: Icon }) => (
                    <Menu.Item
                      key={name}
                      color={color}
                      leftSection={<Icon style={{ width: 14, height: 14 }} />}
                      {...(href ? { component: Link, to: href, className: 'font-medium' } : {})}
                      onClick={onClick}
                    >
                      {name}
                    </Menu.Item>
                  ))}
                </Menu.Dropdown>
              </Menu>
            )}
          </div>

          <div className="flex items-center lg:hidden">
            {/* Mobile menu */}
            <NavigationDrawer user={user} userNavigation={userNavigation} />
          </div>
        </div>
      </div>
    </nav>
  );
}
