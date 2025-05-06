import { errorPopUpTransition } from '@constants/animation';
import { Alert } from '@mantine/core';
import { IconExclamationCircle } from '@tabler/icons-react';
import { motion } from 'motion/react';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

interface FlatErrorProps extends React.PropsWithChildren {
  title?: string;
  children: ReactNode;
  isDismissable?: boolean;
  onErrorClose?: () => void;
}

const FlatError: React.FC<FlatErrorProps> = ({
  title,
  children,
  isDismissable = true,
  onErrorClose = (): void => {}
}) => {
  const { t } = useTranslation();

  const errorTitle = title || t('generic.error');

  return (
    <motion.div key="error-alert" {...errorPopUpTransition}>
      <Alert
        color="pink"
        icon={<IconExclamationCircle />}
        radius="md"
        title={errorTitle}
        variant="light"
        withCloseButton={isDismissable}
        onClose={onErrorClose}
      >
        {children}
      </Alert>
    </motion.div>
  );
};

export default FlatError;
