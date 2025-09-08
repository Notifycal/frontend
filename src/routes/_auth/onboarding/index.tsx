import { getUserProfile } from '@api/userProfile';
import { useOnboardingNavigationStatic } from '@hooks/useOnboardingNavigation';
import type { AuthContext } from '@providers/AuthProvider';
import type { QueryClient } from '@tanstack/react-query';
import { createFileRoute, redirect } from '@tanstack/react-router';
import z from 'zod';

async function editMode(context: { auth: AuthContext; queryClient: QueryClient }): Promise<void> {
  useOnboardingNavigationStatic.setEditMode(true);
  const userProfile = await context.queryClient.ensureQueryData({
    queryKey: ['user-profile'],
    queryFn: getUserProfile
  });
  if (userProfile?.config) {
    useOnboardingNavigationStatic.loadUserProfile(userProfile.config);
  }
  const firstStepPath = useOnboardingNavigationStatic.getFirstStepPath();
  throw redirect({ to: '/onboarding/$step', params: { step: firstStepPath } });
}

function initialOnboarding(): void {
  useOnboardingNavigationStatic.setEditMode(false);
  if (!useOnboardingNavigationStatic.hasOnboardingBeenStarted()) {
    throw redirect({ to: '/onboarding/welcome' });
  } else {
    const path = useOnboardingNavigationStatic.getFirstIncompleteStepPath();
    throw redirect({ to: '/onboarding/$step', params: { step: path } });
  }
}

export const Route = createFileRoute('/_auth/onboarding/')({
  validateSearch: z.object({
    edit: z.boolean().optional()
  }),
  beforeLoad: async ({ search, context }) => {
    if (search.edit) {
      await editMode(context);
    } else {
      initialOnboarding();
    }
  }
});
