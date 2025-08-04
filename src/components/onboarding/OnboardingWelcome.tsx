import { useTranslation } from 'react-i18next';

import RouterLink from '@components/utils/RouterLink';
import { getStepByIndex } from '@constants/onboardingSteps';
import { Button } from '@mantine/core';
import { IconPencil } from '@tabler/icons-react';

const OnboardingWelcome: React.FC = () => {
  const { t } = useTranslation(['translations', 'onboarding']);

  const firstStep = getStepByIndex(0);
  const firstStepPath = firstStep ? firstStep.path : '';

  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <div className="flex items-center justify-center p-6 mb-6 rounded-full bg-green-100">
        <IconPencil className="text-green-600" size="5rem" />
      </div>

      <p className="text-gray-600 max-w-md">{t('welcome.msg1')}</p>
      <p className="text-gray-600 mb-10 max-w-md">{t('welcome.msg2')}</p>
      <Button component={RouterLink} params={{ step: firstStepPath }} size="lg" to="/onboarding/$step">
        {t('generic.button.start', { ns: 'translations' })}
      </Button>
    </div>
  );
};

export default OnboardingWelcome;
