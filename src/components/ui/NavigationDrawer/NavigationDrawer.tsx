import { Burger, Drawer } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import type { IdpName, User } from '@notifycal/shared/types';
import { type Icon, type IconProps, IconUserFilled } from '@tabler/icons-react';
import { Link } from '@tanstack/react-router';
import type { FC, ForwardRefExoticComponent, RefAttributes } from 'react';
import { useTranslation } from 'react-i18next';
import NavigationMenu from '../NavigationMenu/NavigationMenu';

interface UserNavigationItem {
  name: string;
  icon: ForwardRefExoticComponent<IconProps & RefAttributes<Icon>>;
  onClick?: () => void;
  href?: string;
  color?: string;
}

interface NavigationDrawerProps {
  user: User<IdpName>;
  userNavigation: Array<UserNavigationItem>;
}

const NavigationDrawer: FC<NavigationDrawerProps> = ({ user, userNavigation }) => {
  const { t } = useTranslation();
  const [opened, { toggle, close }] = useDisclosure();

  const NavigationItem: FC<{
    href?: string | undefined;
    onClick?: (() => void) | undefined;
    className: string;
    children: React.ReactNode;
  }> = ({ href, onClick, className, children }) => {
    const Component = href ? Link : 'div';
    return (
      <Component
        {...(href ? { to: href } : {})}
        className={`${className} ${href ? 'hover:no-underline text-white hover:text-white' : ''}`}
        onClick={onClick}
      >
        {children}
      </Component>
    );
  };

  return (
    <>
      <div className="group relative inline-flex items-center justify-center rounded-md bg-primary-600 p-2 text-primary-200 hover:bg-primary-500/75 hover:text-white focus:outline-hidden focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-600">
        <Burger aria-label="Toggle navigation" color="white" opened={opened} size="md" onClick={toggle}>
          <span className="absolute -inset-0.5" />
          <span className="sr-only">{t('navigation.openMainMenu')}</span>
        </Burger>
      </div>

      <Drawer
        closeButtonProps={{ size: 'xl' }}
        opened={opened}
        size="xs"
        classNames={{
          content: 'bg-secondary-500',
          header: 'bg-secondary-500',
          close: 'text-primary-200'
        }}
        onClose={toggle}
      >
        <div className="lg:hidden text-white">
          <div className="space-y-1 px-2 pb-3 pt-2">
            <nav className="flex flex-col" onClick={close}>
              <NavigationMenu
                activeClassName="w-fit relative after:absolute cursor-default px-3 py-2 text-lg font-medium text-white hover:no-underline transition-all duration-300 after:right-2 after:bottom-0 after:left-2 after:h-0.5 after:bg-gradient-to-tl after:content-['']"
                className="w-fit relative after:absolute px-3 py-2 text-lg font-medium text-white hover:no-underline transition-all duration-300 hover:scale-105 hover:after:right-2 hover:after:bottom-0 hover:after:left-2 hover:after:h-1 hover:after:bg-gradient-accent1 hover:after:content-['']"
              />
            </nav>
          </div>
          <div className="border-t border-secondary-400 pb-3 pt-4">
            <div className="flex items-center px-5">
              <div className="shrink-0">
                <IconUserFilled className="size-10 rounded-full border-primary-500 border-1 p-0.5" />
              </div>
              <div className="ml-3">
                <div className="text-base font-medium">{user.config?.business.name}</div>
                <div className="text-sm font-medium text-primary-300">{user.email}</div>
              </div>
            </div>
            <div className="mt-3 space-y-1 px-2">
              {userNavigation.map(({ name, href, onClick, icon: Icon }, index) => (
                <NavigationItem
                  key={index}
                  className="block rounded-md px-3 py-2 text-lg font-medium hover:bg-primary-500/75"
                  href={href}
                  onClick={onClick}
                >
                  <div className="flex items-center gap-4">
                    <Icon style={{ width: 14, height: 14 }} />
                    <p>{name}</p>
                  </div>
                </NavigationItem>
              ))}
            </div>
          </div>
        </div>
      </Drawer>
    </>
  );
};

export default NavigationDrawer;
