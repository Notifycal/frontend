import { createFileRoute, redirect, useMatches } from '@tanstack/react-router';
import AppLayout from '../components/layout/AppLayout';

import type { FunctionComponent } from '../common/types';

const AuthLayoutWrapper = (): FunctionComponent => {
  const matches = useMatches();
  const currentRoute = matches[matches.length - 1];

  const defaultLayoutProps = {
    useFancyHeader: false,
    fancyHeaderTitle: ''
  };

  const layoutConfig = currentRoute && currentRoute.pathname === '/dashboard' ? {
    useFancyHeader: true,
    fancyHeaderTitle: 'Dashboard'
  } : defaultLayoutProps;

  return (
    <AppLayout {...layoutConfig} />
  )
};


// This route (and all the routes starting with _) is not an actual route
// In fact this defines the layout of all authenticated routes.
export const Route = createFileRoute('/_auth')({
  beforeLoad: ({ context, location }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: '/',
        search: {
          redirect: location.href,
        },
      });
    }
  },
  component: AuthLayoutWrapper,
});
