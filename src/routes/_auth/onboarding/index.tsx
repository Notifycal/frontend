import { getUserProfile } from '@api/userProfile';
import { useOnboardingNavigationStatic } from '@hooks/useOnboardingNavigation';
import { createFileRoute, redirect } from '@tanstack/react-router';
import z from 'zod';

export const Route = createFileRoute('/_auth/onboarding/')({
  validateSearch: z.object({
    edit: z.boolean().optional()
  }),
  beforeLoad: async ({ search, context }) => {
    if (search.edit) {
      useOnboardingNavigationStatic.setEditMode(true);
      await context.queryClient
        .ensureQueryData({
          queryKey: ['user-profile'],
          queryFn: getUserProfile
        })
        .then((userProfile) => {
          if (userProfile?.config) {
            useOnboardingNavigationStatic.loadUserProfile(userProfile.config);
          }
        });
      const firstStepPath = useOnboardingNavigationStatic.getFirstStepPath();
      throw redirect({ to: '/onboarding/$step', params: { step: firstStepPath } });
    } else {
      useOnboardingNavigationStatic.setEditMode(false);
      const firstIncompleteStep = useOnboardingNavigationStatic.getFirstIncompleteStepIndex();
      if (firstIncompleteStep === 0) {
        throw redirect({ to: '/onboarding/welcome' });
      } else {
        const path = useOnboardingNavigationStatic.getFirstIncompleteStepPath();
        throw redirect({ to: '/onboarding/$step', params: { step: path } });
      }
    }
  }
});
