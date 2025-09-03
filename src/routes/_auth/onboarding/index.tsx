import { getUserProfile } from '@/api/userProfile';
import { getFirstIncompleteStepIndex, getStepByIndex } from '@constants/onboardingSteps';
import { useOnboardingStore } from '@store/useOnboardingStore';
import { createFileRoute, redirect } from '@tanstack/react-router';
import z from 'zod';

export const Route = createFileRoute('/_auth/onboarding/')({
  validateSearch: z.object({
    edit: z.boolean().optional()
  }),
  beforeLoad: async ({ search }) => {
    if (search.edit) {
      await getUserProfile().then(
        (userProfile) => {
          if (userProfile?.config) {
            const { loadConfigFromUserProfile } = useOnboardingStore.getState();
            loadConfigFromUserProfile(userProfile.config);
          }
        },
        (error) => {
          console.error('Error loading user profile for edit mode:', error);
        }
      );
    }

    const { completedSteps } = useOnboardingStore.getState();
    const firstIncompleteIndex = getFirstIncompleteStepIndex(completedSteps) || 0;
    if (!search.edit && firstIncompleteIndex === 0) {
      throw redirect({ to: '/onboarding/welcome' });
    }
    const path = getStepByIndex(firstIncompleteIndex)?.path || '';
    throw redirect({ to: '/onboarding/$step', params: { step: path } });
  }
});
