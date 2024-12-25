import { useTranslation } from 'react-i18next';

import { Link } from '@tanstack/react-router';

import type { FunctionComponent } from '@common/types';

export const NotFoundPage = (): FunctionComponent => {
  const { t } = useTranslation();

  return (
    <main className="relative isolate h-screen">
      <img
        alt=""
        className="absolute inset-0 -z-10 size-full object-cover object-top"
        src="https://images.unsplash.com/photo-1545972154-9bb223aac798?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=3050&q=80&exp=8&con=-15&sat=-75"
      />
      <div className="mx-auto max-w-7xl px-6 py-32 text-center sm:py-40 lg:px-8">
        <p className="text-base/8 font-semibold text-white">404</p>
        <h1 className="mt-4 text-balance text-5xl font-semibold tracking-tight text-white sm:text-7xl">
          {t('404.pageNotFound')}
        </h1>
        <p className="mt-6 text-pretty text-lg font-medium text-white/70 sm:text-xl/8">
          {t('404.weCouldNotFindThePage')}
        </p>
        <div className="mt-10 flex justify-center">
          <Link className="text-sm/7 font-semibold text-white" to="/dashboard">
            <span aria-hidden="true">&larr;</span> {t('404.backToDashboard')}
          </Link>
        </div>
      </div>
    </main>
  );
};
