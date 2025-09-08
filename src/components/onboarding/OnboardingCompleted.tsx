import { useOnboardingNavigation } from '@hooks/useOnboardingNavigation';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '@mantine/core';
import { IconCircleCheck } from '@tabler/icons-react';
import { Link } from '@tanstack/react-router';

const OnboardingCompleted: React.FC = () => {
  const { resetOnboarding } = useOnboardingNavigation();
  const { t } = useTranslation('onboarding');

  useEffect(() => {
    resetOnboarding();
  }, [resetOnboarding]);

  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <div className="flex items-center justify-center p-6 mb-6 rounded-full bg-primary-100">
        <IconCircleCheck className="text-primary-600" size="5rem" />
      </div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">{t('completed.heading')}</h2>
      <p className="text-gray-600 mb-6 max-w-md">{t('completed.subheading')}</p>
      <Button component={Link} size="lg" to="/dashboard">
        {t('completed.goToDashboard')}
      </Button>
    </div>
  );
};

export default OnboardingCompleted;
