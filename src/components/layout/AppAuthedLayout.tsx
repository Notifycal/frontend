import type { FC, ReactNode } from 'react';

import Navigation from '@components/ui/Navigation/Navigation';
import { useRouteStaticData } from '@hooks/useRouteStaticData';

import clsx from 'clsx';

import { Route } from '@routes/_auth';

interface AppAuthedLayoutProps {
  children: ReactNode;
}

const AppAuthedLayout: FC<AppAuthedLayoutProps> = ({ children }) => {
  const { header: { useFancyHeader = false, fancyHeaderTitle = '' } = {} } = useRouteStaticData(['layout.header']);

  const { user } = Route.useLoaderData();

  return (
    <>
      <div className={clsx({ 'bg-secondary-500': true, 'pb-32': useFancyHeader })}>
        {/* TODO global state */}
        {user && <Navigation user={user} />}

        {useFancyHeader && (
          <header className="py-10">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <h1 className="text-3xl font-bold tracking-tight text-white">{fancyHeaderTitle}</h1>
            </div>
          </header>
        )}
      </div>
      <main className={clsx({ '-mt-32': useFancyHeader })}>
        <div className="mx-auto max-w-7xl px-4 pb-4 sm:px-6 lg:px-8">
          <div className="rounded-lg px-5 py-6 sm:px-6">{children}</div>
        </div>
      </main>
    </>
  );
};

export default AppAuthedLayout;
