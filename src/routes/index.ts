import { createFileRoute, redirect } from '@tanstack/react-router';
import { isAuthenticated } from '../auth/auth';
import { Login } from '../pages/Login';

export const Route = createFileRoute('/')({
  beforeLoad: ({ location }) => {
    // If the user is authenticated, there is no need to show them the login page.
    if (isAuthenticated()) {
      return redirect({
        to: '/dashboard'
      });
    }
  },
  component: Login
});
