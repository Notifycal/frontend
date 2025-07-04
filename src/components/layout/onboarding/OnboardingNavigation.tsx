import { isLastStep } from '@constants/onboardingSteps';
import OnboardingBackButton from '@components/onboarding/OnboardingBackButton';

import { useOnboardingStore } from '@store/useOnboardingStore';
import { useTranslation } from 'react-i18next';

import { Button, Group } from '@mantine/core';
import { IconArrowRight, IconCheck } from '@tabler/icons-react';

interface OnboardingNavigationProps {
  canProceed: boolean;
  nextButtonLabel?: string;
  onProceed: () => void;
  isSubmitting?: boolean;
}

const OnboardingNavigation: React.FC<OnboardingNavigationProps> = ({
  canProceed,
  nextButtonLabel,
  onProceed,
  isSubmitting = false
}) => {
  const { currentStep } = useOnboardingStore();
  const { t } = useTranslation();

  const isTheLastStep = isLastStep(currentStep);
  const nextLabel = nextButtonLabel || t(isTheLastStep ? 'generic.button.complete' : 'generic.button.continue');

  return (
    <Group justify="space-between" mt="xl" pt="md">
      {currentStep > 0 ? <OnboardingBackButton /> : <div />}

      <Button
        disabled={!canProceed}
        loading={isSubmitting}
        rightSection={!isTheLastStep ? <IconArrowRight size={16} /> : <IconCheck size={16} />}
        onClick={onProceed}
      >
        {nextLabel}
      </Button>
    </Group>
  );
};

export default OnboardingNavigation;
