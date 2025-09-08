import OnboardingBackButton from '@components/onboarding/OnboardingBackButton';
import { useOnboardingNavigation } from '@hooks/useOnboardingNavigation';
import { useTranslation } from 'react-i18next';

import { Button, Group } from '@mantine/core';
import { IconArrowRight, IconCheck } from '@tabler/icons-react';

interface OnboardingNavigationProps {
  canProceed: boolean;
  nextButtonLabel?: string | undefined;
  onProceed: () => void;
  isSubmitting?: boolean;
}

const OnboardingNavigation: React.FC<OnboardingNavigationProps> = ({
  canProceed,
  nextButtonLabel,
  onProceed,
  isSubmitting = false
}) => {
  const { canGoBack, isLastStep } = useOnboardingNavigation();
  const { t } = useTranslation();

  const nextLabel = nextButtonLabel || t(isLastStep ? 'generic.button.complete' : 'generic.button.continue');

  return (
    <Group justify="space-between" mt="xl" pt="md">
      {canGoBack ? <OnboardingBackButton /> : <div />}

      <Button
        disabled={!canProceed}
        loading={isSubmitting}
        rightSection={!isLastStep ? <IconArrowRight size={16} /> : <IconCheck size={16} />}
        onClick={onProceed}
      >
        {nextLabel}
      </Button>
    </Group>
  );
};

export default OnboardingNavigation;
