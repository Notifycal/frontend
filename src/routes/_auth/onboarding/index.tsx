import { getUserProfile } from '@api/userProfile';
import { useOnboardingNavigationStatic } from '@hooks/useOnboardingNavigation';
import { createFileRoute, redirect } from '@tanstack/react-router';
import z from 'zod';

export const Route = createFileRoute('/_auth/onboarding/')({
  validateSearch: z.object({
    edit: z.boolean().optional()
  }),
  beforeLoad: async ({ search }) => {
    if (search.edit) {
      useOnboardingNavigationStatic.setEditMode(true);
      try {
        const userProfile = await getUserProfile();
        if (userProfile?.config) {
          useOnboardingNavigationStatic.loadUserProfile(userProfile.config);
        }
      } catch (error) {
        console.error('Error loading user profile for edit mode:', error);
      }
    } else {
      useOnboardingNavigationStatic.setEditMode(false);
    }

    const path = useOnboardingNavigationStatic.getFirstIncompleteStepPath();
    if (!search.edit && !path) {
      throw redirect({ to: '/onboarding/welcome' });
    }
    throw redirect({ to: '/onboarding/$step', params: { step: path } });
  }
});
