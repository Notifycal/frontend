import { Outlet, useMatches } from '@tanstack/react-router';

import Navigation from '@components/ui/Navigation/Navigation';

import clsx from 'clsx';

import type { JSX } from 'react';

const user = {
  name: 'Tom Cook',
  email: 'tom@example.com',
  imageUrl:
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
};

export default function AppLayout(): JSX.Element {
  const matches = useMatches();
  const currentRoute = matches[matches.length - 1];
  const routeStaticData = currentRoute?.staticData;

  const { useFancyHeader = false, fancyHeaderTitle = '' } = routeStaticData?.layout || {};

  return (
    <div className="min-h-full">
      <div className={clsx({ 'bg-indigo-600': true, 'pb-32': useFancyHeader })}>
        {/* TODO global state */}
        <Navigation user={user} />

        {useFancyHeader && (
          <header className="py-10">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <h1 className="text-3xl font-bold tracking-tight text-white">{fancyHeaderTitle}</h1>
            </div>
          </header>
        )}
      </div>
      <main className={clsx({ '-mt-32': useFancyHeader })}>
        <div className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
          <div className="rounded-lg bg-white px-5 py-6 shadow-sm sm:px-6">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
