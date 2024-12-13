import { createFileRoute, redirect } from '@tanstack/react-router';
import { Dashboard } from '../pages/Dashboard';

import { isAuthenticated } from '../auth/auth';

export const Route = createFileRoute('/dashboard')({
  beforeLoad: ({ location }) => {
    if (!isAuthenticated()) {
      return redirect({
        to: '/',
        search: {
          // Use the current location to power a redirect after login
          // (Do not use `router.state.resolvedLocation` as it can
          // potentially lag behind the actual current location)
          redirect: location.href
        }
      });
    }
  },
  component: Dashboard
});
