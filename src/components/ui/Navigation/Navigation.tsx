import { Link } from '@tanstack/react-router';

import { Burger, Menu, Text, rem, Drawer } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

import {
  IconSettings,
  IconSearch,
  IconPhoto,
  IconMessageCircle,
  IconTrash,
  IconArrowsLeftRight
} from '@tabler/icons-react';

import type { FunctionComponent } from '../../../common/types';

import type { UserModel } from '../../../types/UserModel';

const navigation = [
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Template', href: '/template' },
  { name: 'Billing', href: '/billing' }
];

const userNavigation = [
  { name: 'Your Profile', href: '#' },
  { name: 'Settings', href: '#' },
  { name: 'Sign out', href: '#' }
];

interface UserProps {
  user: UserModel
};

const ProfilePictureDesktop = (props: UserProps): FunctionComponent => {
  const { user } = props;
  return (
    <Menu shadow="md" width={200} position="bottom-end">
      <Menu.Target>
        <button
          className="relative flex rounded-full bg-indigo-600 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600"
          type="button"
        >
          <span className="absolute -inset-1.5" />
          <span className="sr-only">Open user menu</span>
          <img alt="" src={user.imageUrl} className="size-8 rounded-full" />
        </button>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item leftSection={<IconSettings style={{ width: rem(14), height: rem(14) }} />}>Settings</Menu.Item>
        <Menu.Item leftSection={<IconMessageCircle style={{ width: rem(14), height: rem(14) }} />}>Messages</Menu.Item>
        <Menu.Item leftSection={<IconPhoto style={{ width: rem(14), height: rem(14) }} />}>Gallery</Menu.Item>
        <Menu.Item
          leftSection={<IconSearch style={{ width: rem(14), height: rem(14) }} />}
          rightSection={
            <Text size="xs" c="dimmed">
              ⌘K
            </Text>
          }
        >
          Search
        </Menu.Item>

        <Menu.Divider />

        <Menu.Label>Danger zone</Menu.Label>
        <Menu.Item leftSection={<IconArrowsLeftRight style={{ width: rem(14), height: rem(14) }} />}>
          Transfer my data
        </Menu.Item>
        <Menu.Item color="red" leftSection={<IconTrash style={{ width: rem(14), height: rem(14) }} />}>
          Delete my account
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};


export default function Navigation(props: UserProps): FunctionComponent {
  const { user } = props;

  const [opened, { toggle }] = useDisclosure();

  return (
    <nav className="border-b border-indigo-300/25 bg-indigo-600 lg:border-none">
      <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:px-8">
        <div className="relative flex h-16 items-center justify-between lg:border-b lg:border-indigo-400/25">
          <div className="flex items-center px-2 lg:px-0">
            <div className="shrink-0">
              <img
                alt="Your Company"
                className="block size-8"
                src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=300"
              />
            </div>
            <div className="hidden lg:ml-10 lg:block">
              <div className="flex space-x-4">
                {navigation.map((item) => (
                  <Link key={item.href}
                    activeProps={{ className: 'bg-indigo-700' }}
                    className="rounded-md px-3 py-2 text-sm font-medium text-white hover:bg-indigo-500/75"
                    to={item.href}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <div className="flex lg:hidden">
            {/* Mobile menu button */}
            <button className="group relative inline-flex items-center justify-center rounded-md bg-indigo-600 p-2 text-indigo-200 hover:bg-indigo-500/75 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600">
              <span className="absolute -inset-0.5" />
              <span className="sr-only">Open main menu</span>
              <Burger
                aria-label="Toggle navigation"
                opened={opened}
                size="sm"
                classNames={{
                  burger: 'bg-indigo-200 before:bg-indigo-200 after:bg-indigo-200'
                }}
                onClick={toggle}
              />
            </button>
          </div>

          <div className="hidden lg:ml-4 lg:block">
            <div className="flex items-center">
              <ProfilePictureDesktop user={user}/>
            </div>
          </div>
        </div>
      </div>

      <Drawer
        opened={opened}
        classNames={{
          content: 'bg-indigo-600',
          header: 'bg-indigo-600',
          close: 'text-indigo-200'
        }}
        onClose={toggle}
      >
        <div className="lg:hidden">
          <div className="space-y-1 px-2 pb-3 pt-2">
            {navigation.map((item) => (
              <Link key={item.href}
                activeProps={{ className: 'bg-indigo-700 text-white' }}
                className="block rounded-md px-3 py-2 text-base font-medium text-white hover:bg-indigo-500/75"
                to={item.href}
              >
                {item.name}
              </Link>
            ))}
          </div>
          <div className="border-t border-indigo-700 pb-3 pt-4">
            <div className="flex items-center px-5">
              <div className="shrink-0">
                <img alt="" className="size-10 rounded-full" src={user.imageUrl} />
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-white">{user.name}</div>
                <div className="text-sm font-medium text-indigo-300">{user.email}</div>
              </div>
            </div>
            <div className="mt-3 space-y-1 px-2">
              {userNavigation.map((item) => (
                <a key={item.name}
                  className="block rounded-md px-3 py-2 text-base font-medium text-white hover:bg-indigo-500/75"
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
};
