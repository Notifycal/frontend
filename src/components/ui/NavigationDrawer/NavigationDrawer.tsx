import { Burger, Drawer, rem } from '@mantine/core';
import NavigationMenu from '../NavigationMenu/NavigationMenu';
import { useDisclosure } from '@mantine/hooks';
import type { FC, ForwardRefExoticComponent, RefAttributes } from 'react';
import type { UserModel } from '@our-types/UserModel';
import { type IconProps, type Icon, IconUserFilled } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

interface NavigationDrawerProps {
  user: UserModel;
  userNavigation: Array<{
    name: string;
    onClick: () => void;
    color: string;
    icon: ForwardRefExoticComponent<IconProps & RefAttributes<Icon>>;
  }>;
}

const NavigationDrawer: FC<NavigationDrawerProps> = ({ user, userNavigation }) => {
  const { t } = useTranslation();
  const [opened, { toggle, close }] = useDisclosure();

  return (
    <>
      <div className="group relative inline-flex items-center justify-center rounded-md bg-primary-600 p-2 text-primary-200 hover:bg-primary-500/75 hover:text-white focus:outline-hidden focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-600">
        <Burger aria-label="Toggle navigation" color="white" opened={opened} size="sm" onClick={toggle}>
          <span className="absolute -inset-0.5" />
          <span className="sr-only">{t('navigation.openMainMenu')}</span>
        </Burger>
      </div>

      <Drawer
        opened={opened}
        size="xs"
        classNames={{
          content: 'bg-primary-600',
          header: 'bg-primary-600',
          close: 'text-primary-200'
        }}
        onClose={toggle}
      >
        <div className="lg:hidden text-white">
          <div className="space-y-1 px-2 pb-3 pt-2">
            <nav onClick={close}>
              <NavigationMenu
                activeClassName="bg-primary-700"
                className="block rounded-md px-3 py-2 text-base font-medium text-white hover:bg-primary-500/75"
              />
            </nav>
          </div>
          <div className="border-t border-primary-700 pb-3 pt-4">
            <div className="flex items-center px-5">
              <div className="shrink-0">
                <IconUserFilled className="size-10 rounded-full border-primary-500 border-1 p-0.5" />
              </div>
              <div className="ml-3">
                <div className="text-base font-medium">{user.name}</div>
                <div className="text-sm font-medium text-primary-300">{user.email}</div>
              </div>
            </div>
            <div className="mt-3 space-y-1 px-2">
              {userNavigation.map(({ name, onClick, icon: Icon }) => (
                <div
                  className="block rounded-md px-3 py-2 text-base font-medium  hover:bg-primary-500/75"
                  onClick={onClick}
                >
                  <div className="flex items-center gap-4">
                    <Icon style={{ width: rem(14), height: rem(14) }} />
                    <p>{name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Drawer>
    </>
  );
};

export default NavigationDrawer;
