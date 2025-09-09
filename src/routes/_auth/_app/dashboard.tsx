import { getUserProfile } from '@/api/userProfile';
import Billing from '@pages/Billing';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_auth/_app/dashboard')({
  loader: async ({ context }) => {
    const user = await context.queryClient.fetchQuery({
      queryKey: ['user-profile'],
      queryFn: getUserProfile
    });
    return { user };
  },
  component: Billing,
  staticData: {
    layout: {
      header: {
        useFancyHeader: true,
        fancyHeaderTitle: 'Dashboard'
      }
    }
  }
});
