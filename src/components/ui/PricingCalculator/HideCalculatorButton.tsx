import { Button } from '@mantine/core';
import { IconChevronUp } from '@tabler/icons-react';
import type { ReactElement } from 'react';

interface HideCalculatorButtonProps {
  onCollapse: () => void;
}

export const HideCalculatorButton = ({ onCollapse }: HideCalculatorButtonProps): ReactElement => (
  <div className="mt-4 text-center">
    <Button
      className="text-gray-600 hover:underline"
      size="sm"
      variant="transparent"
      onClick={onCollapse}
    >
      <IconChevronUp className="mr-2" size={20} />
      <span>Ocultar calculadora</span>
      <IconChevronUp className="ml-2" size={20} />
    </Button>
  </div>
);