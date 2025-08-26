import { Burger, Drawer, Menu, rem } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import NotifycalIsologo from '@notifycal/shared/assets/logos/notifycal-isologo.svg?react';
import type { UserModel } from '@our-types/UserModel';
import { useAuth } from '@providers/AuthProvider';
import { IconLogout2 } from '@tabler/icons-react';
import { Link } from '@tanstack/react-router';
import type { JSX } from 'react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Template', href: '/template' },
  { name: 'Billing', href: '/billing' },
  { name: 'Feedback', href: '/feedback' }
];

const userNavigation = [
  { name: 'Your Profile', href: '#' },
  { name: 'Settings', href: '#' },
  { name: 'Sign out', href: '#' }
];

interface NavigationMenuProps {
  className: string;
  activeClassName: string;
}

const NavigationMenu = ({ className, activeClassName }: NavigationMenuProps): JSX.Element => (
  <>
    {navigation.map((item) => (
      <Link key={item.href} activeProps={{ className: activeClassName }} className={className} to={item.href}>
        {item.name}
      </Link>
    ))}
  </>
);

interface UserProps {
  user: UserModel;
}

export default function Navigation(props: UserProps): JSX.Element {
  const { user } = props;

  const auth = useAuth();

  const [opened, { toggle }] = useDisclosure();

  const onLogoutHandler = auth.logout;

  return (
    <nav className="border-b border-primary-300/25 bg-primary-800 lg:border-none">
      <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:px-8">
        <div className="relative flex h-16 items-center justify-between lg:border-b lg:border-primary-400/25">
          <div className="flex items-center px-2 lg:px-0">
            <div className="shrink-0">
              <NotifycalIsologo className="text-primary-500 h-10" />
            </div>
            <div className="hidden lg:ml-10 lg:block">
              <div className="flex space-x-4">
                <NavigationMenu
                  activeClassName="bg-primary-900"
                  className="rounded-md px-3 py-2 text-sm font-medium text-white hover:bg-primary-500/75"
                />
              </div>
            </div>
          </div>
          <div className="flex lg:hidden">
            {/* Mobile menu button */}
            <div className="group relative inline-flex items-center justify-center rounded-md bg-primary-600 p-2 text-primary-200 hover:bg-primary-500/75 hover:text-white focus:outline-hidden focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-600">
              <Burger
                aria-label="Toggle navigation"
                opened={opened}
                size="sm"
                classNames={{
                  burger: 'bg-primary-200 before:bg-primary-200 after:bg-primary-200'
                }}
                onClick={toggle}
              >
                <span className="absolute -inset-0.5" />
                <span className="sr-only">Open main menu</span>
              </Burger>
            </div>
          </div>

          <div className="hidden lg:ml-4 lg:block">
            <div className="flex items-center">
              <Menu position="bottom-end" shadow="md" width={200}>
                <Menu.Target>
                  <button
                    className="relative flex rounded-full bg-primary-600 text-sm text-white focus:outline-hidden focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-600"
                    type="button"
                  >
                    <span className="absolute -inset-1.5" />
                    <span className="sr-only">Open user menu</span>
                    <img alt="" className="size-8 rounded-full" src={user.imageUrl} />
                  </button>
                </Menu.Target>

                <Menu.Dropdown>
                  <Menu.Item
                    color="red"
                    leftSection={<IconLogout2 style={{ width: rem(14), height: rem(14) }} />}
                    onClick={onLogoutHandler}
                  >
                    Logout
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </div>
          </div>
        </div>
      </div>

      <Drawer
        opened={opened}
        classNames={{
          content: 'bg-primary-600',
          header: 'bg-primary-600',
          close: 'text-primary-200'
        }}
        onClose={toggle}
      >
        <div className="lg:hidden">
          <div className="space-y-1 px-2 pb-3 pt-2">
            <NavigationMenu
              activeClassName="bg-primary-700 text-white"
              className="block rounded-md px-3 py-2 text-base font-medium text-white hover:bg-primary-500/75"
            />
          </div>
          <div className="border-t border-primary-700 pb-3 pt-4">
            <div className="flex items-center px-5">
              <div className="shrink-0">
                <img alt="" className="size-10 rounded-full" src={user.imageUrl} />
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-white">{user.name}</div>
                <div className="text-sm font-medium text-primary-300">{user.email}</div>
              </div>
            </div>
            <div className="mt-3 space-y-1 px-2">
              {userNavigation.map((item) => (
                <a
                  key={item.name}
                  className="block rounded-md px-3 py-2 text-base font-medium text-white hover:bg-primary-500/75"
                  href={item.href}
                >
                  {item.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </Drawer>
    </nav>
  );
}
