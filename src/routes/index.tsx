import { createFileRoute, redirect } from '@tanstack/react-router';
import { Login } from '../pages/Login';

import { z } from 'zod';

export const Route = createFileRoute('/')({
  validateSearch: z.object({
    redirect: z.string().optional().catch('')
  }),
  beforeLoad: ({ context, search }) => {
    // If the user is authenticated, there is no need to show them the login page.
    if (context.auth.isAuthenticated) {
      throw redirect({ to: search.redirect || '/dashboard' });
    }
  },
  component: Login
});
