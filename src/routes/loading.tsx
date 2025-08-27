import AppAuthedLayout from '@components/layout/AppAuthedLayout';
import { createFileRoute, redirect } from '@tanstack/react-router';
import z from 'zod';

export const Route = createFileRoute('/loading')({
  component: () => (
    <AppAuthedLayout>
      <></>
    </AppAuthedLayout>
  ),
  validateSearch: z.object({
    redirect: z.string().optional().catch('')
  }),
  beforeLoad: ({ context, search }) => {
    // If the user is authenticated, there is no need to show them the login page.
    if (context.auth.isAuthenticated) {
      throw redirect({ to: search.redirect || '/dashboard' });
    }
  }
});
