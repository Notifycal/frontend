import { Button } from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { useOnboardingNavigation } from '@hooks/useOnboardingNavigation';

const OnboardingBackButton: FC = () => {
  const { t } = useTranslation();
  const { handleBackNavigation } = useOnboardingNavigation();

  return (
    <Button leftSection={<IconArrowLeft size={16} />} variant="default" onClick={handleBackNavigation}>
      {t('generic.button.back')}
    </Button>
  );
};

export default OnboardingBackButton;
