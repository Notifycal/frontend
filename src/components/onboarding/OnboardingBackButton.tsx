import { getStepByIndex } from '@constants/onboardingSteps';
import { Button } from '@mantine/core';
import { useOnboardingStore } from '@store/useOnboardingStore';
import { IconArrowLeft } from '@tabler/icons-react';
import { useNavigate } from '@tanstack/react-router';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';

const OnboardingBackButton: FC = () => {
  const { currentStep } = useOnboardingStore();
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <Button
      leftSection={<IconArrowLeft size={16} />}
      variant="default"
      onClick={async () => {
        const previousStep = currentStep - 1;
        const step = getStepByIndex(previousStep);
        if (step) {
          await navigate({
            to: '/onboarding/$step',
            params: { step: step.path }
          });
        }
      }}
    >
      {t('generic.button.back', { ns: 'translations' })}
    </Button>
  );
};

export default OnboardingBackButton;
