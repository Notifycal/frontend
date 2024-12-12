import type { FunctionComponent } from "../../common/types";

import classNames from 'classnames';

import Navigation from "../ui/Navigation/Navigation";

export default function AppLayout({user, children, useFancyHeader, fancyHeaderTitle}): FunctionComponent {
  return (
    <div className="min-h-full">
      <div className={classNames({ 'bg-indigo-600': true, 'pb-32': useFancyHeader })}>
        {/* TODO global state */}
        <Navigation user={user} />

        
        { useFancyHeader && <header className="py-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight text-white">{fancyHeaderTitle}</h1>
          </div>
        </header>}
      </div>
      <main className={classNames({ '-mt-32': useFancyHeader })}>
        <div className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
          <div className="rounded-lg bg-white px-5 py-6 shadow sm:px-6">{children}</div>
        </div>
      </main>
    </div>
  );
}
