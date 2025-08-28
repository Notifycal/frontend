import { Menu } from '@mantine/core';
import NotifycalIsologo from '@notifycal/shared/assets/logos/notifycal-isologo.svg?react';
import { useAuth } from '@providers/AuthProvider';
import { IconLogout2, IconUserFilled } from '@tabler/icons-react';
import type { JSX } from 'react';
import NavigationMenu from '../NavigationMenu/NavigationMenu';
import NavigationDrawer from '../NavigationDrawer/NavigationDrawer';
import { useTranslation } from 'react-i18next';
import type { IdpName, User } from '@notifycal/shared/types';
import { Link } from '@tanstack/react-router';

interface UserProps {
  user: User<IdpName>;
}

export default function Navigation(props: UserProps): JSX.Element {
  const auth = useAuth();
  const onLogoutHandler = auth.logout;
  const { t } = useTranslation();

  const userNavigation = [
    {
      name: t('navigation.signOut'),
      onClick: onLogoutHandler,
      color: 'red',
      icon: IconLogout2
    }
  ];

  const { user } = props;

  return (
    <nav className="border-b border-secondary-500/25 bg-secondary-500 lg:border-none shadow-md py-5">
      <div className="mx-auto px-2 sm:px-4 lg:px-8">
        <div className="relative flex h-16 items-stretch justify-between lg:border-b lg:border-primary-400/25">
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
                  activeClassName="inset-shadow-[0_2px_4px_var(--color-primary-900)] bg-secondary-600 hover:inset-shadow-none"
                  className="block rounded-md px-3 py-2 text-md font-medium text-white hover:bg-accent1-500/75 hover:text-accent1-800 hover:no-underline transition-all duration-300 hover:scale-105 hover:shadow-md hover:shadow-primary-900"
                />
              </div>
            </div>
          </div>

          <div className="hidden lg:ml-4 lg:block">
            <div className="flex items-center">
              {user && (
                <Menu position="bottom-end" shadow="md" width={200}>
                  <Menu.Target>
                    <button
                      className="group flex items-center justify-center gap-2 px-4 py-2 hover:bg-accent1-500/75 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-md hover:shadow-primary-900 hover:border-accent1-300"
                      type="button"
                    >
                      <div className="text-right">
                        <div className="text-sm font-medium text-primary-200 group-hover:text-accent1-900">
                          {user.config?.business.name}
                        </div>
                        <div className="text-xs font-medium text-primary-50 group-hover:text-accent1-800">
                          {user.email}
                        </div>
                      </div>
                      <div className="size-8 relative flex rounded-full bg-primary-600 text-sm text-white focus:outline-hidden focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-600">
                        <span className="absolute -inset-1.5" />
                        <span className="sr-only">{t('navigation.openMainMenu')}</span>
                        <IconUserFilled className="size-8 rounded-full border-primary-500 border-1 p-0.5" />
                      </div>
                    </button>
                  </Menu.Target>

                  <Menu.Dropdown>
                    {userNavigation.map(({ name, onClick, color, icon: Icon }) => (
                      <Menu.Item
                        color={color}
                        leftSection={<Icon style={{ width: 14, height: 14 }} />}
                        onClick={onClick}
                      >
                        {name}
                      </Menu.Item>
                    ))}
                  </Menu.Dropdown>
                </Menu>
              )}
            </div>
          </div>

          <div className="flex lg:hidden">
            {/* Mobile menu */}
            <NavigationDrawer user={user} userNavigation={userNavigation} />
          </div>
        </div>
      </div>
    </nav>
  );
}
