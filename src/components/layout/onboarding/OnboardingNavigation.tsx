import { getStepByIndex, isLastStep } from '@constants/onboardingSteps';

import { useOnboardingStore } from '@store/useOnboardingStore';
import { useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

import { Button, Group } from '@mantine/core';
import { IconArrowLeft, IconArrowRight, IconCheck } from '@tabler/icons-react';

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
  const navigate = useNavigate();
  const { currentStep } = useOnboardingStore();
  const isTheLastStep = isLastStep(currentStep);

  const { t } = useTranslation();

  const nextLabel = nextButtonLabel || t(isTheLastStep ? 'generic.button.complete' : 'generic.button.continue');

  const handleBack = async (): Promise<void> => {
    if (currentStep > 0) {
      const previousStep = currentStep - 1;
      const step = getStepByIndex(previousStep);
      if (step) {
        await navigate({ to: '/onboarding/$step', params: { step: step.path } });
      }
    }
  };

  return (
    <Group justify="space-between" mt="xl" pt="md">
      {currentStep !== 0 ? (
        <Button
          disabled={currentStep === 0}
          leftSection={<IconArrowLeft size={16} />}
          variant="default"
          onClick={handleBack}
        >
          {t('generic.button.back')}
        </Button>
      ) : (
        <div />
      )}

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
