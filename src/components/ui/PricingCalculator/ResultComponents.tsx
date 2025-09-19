import { Button, Text } from '@mantine/core';
import type { TierInfoWithIcon } from '@notifycal/shared/components';
import type { TierId } from '@notifycal/shared/types';
import { IconArrowRight, IconChartBar, IconClock } from '@tabler/icons-react';
import type { ReactElement } from 'react';

export const MonthlyEstimateAndMetrics = (
  monthlyMessages: number,
  savedHours: number,
  minutesPerMessage: number,
  isContactUs = false
): ReactElement => (
  <div className="space-y-1 md:col-span-6">
    <div className="p-1 px-4 flex items-center gap-3">
      <IconChartBar className="ml-1 text-accent2-600 hidden xs:inline-block" size={20} />
      <div>
        <div className="text-lg font-semibold text-gray-800">
          {monthlyMessages}
          {isContactUs ? '+' : ''} citas / mes
        </div>
        <div className="text-xs text-gray-400">Tu estimación mensual</div>
      </div>
    </div>
    <div className="p-1 px-4 flex items-center gap-3">
      <IconClock className="ml-2 hidden xs:inline-block" size={16} />
      <div>
        <div className="text-sm text-gray-700">
          <span>
            {monthlyMessages} mensajes × {minutesPerMessage} minutos =
          </span>
          <span className="font-semibold"> {savedHours} h ahorradas</span>
        </div>
        <div className="text-xs text-gray-400">Basado en {minutesPerMessage} minutos por mensaje manual</div>
      </div>
    </div>
  </div>
);

export const Arrow = (orientation: 'horizontal' | 'vertical' = 'horizontal'): ReactElement => (
  <div
    className={
      orientation === 'horizontal'
        ? 'col-span-1 text-center flex flex-col items-center justify-center h-full'
        : 'text-center'
    }
  >
    <IconArrowRight
      className={`text-accent2-300 ${orientation === 'vertical' ? 'mx-auto rotate-90' : ''}`}
      size={orientation === 'horizontal' ? 58 : 32}
    />
  </div>
);

interface ActionProps {
  type: 'contact' | 'tier';
  tier: TierInfoWithIcon;
  isSelectButtonLoading: boolean;
  contactUrl: string;
  onTierSelect: (tierId: TierId) => void;
}

export const Action = ({ type, tier, isSelectButtonLoading, contactUrl, onTierSelect }: ActionProps): ReactElement => {
  const baseProps = {
    className: 'w-full md:w-auto md:min-w-62 text-sm md:text-xl py-4 font-bold',
    size: 'xl' as const,
    variant: 'filled' as const
  };

  const contactProps = {
    ...baseProps,
    color: 'accent2' as const,
    component: 'a' as const,
    href: contactUrl
  };

  const tierProps = {
    ...baseProps,
    color: 'primary' as const,
    loading: isSelectButtonLoading,
    onClick: (): void => {
      onTierSelect(tier.id);
    }
  };

  return (
    <div className="mx-auto text-center md:col-span-5">
      <Button {...(type === 'contact' ? contactProps : tierProps)}>
        {type === 'contact' ? (
          <span>Contactar</span>
        ) : (
          <>
            <span className="md:hidden">Plan {tier?.displayName}</span>
            <span className="hidden md:inline">Seleccionar Plan {tier?.displayName}</span>
          </>
        )}
      </Button>
      {type === 'contact' && (
        <Text className="text-gray-600 mt-2" size="xs">
          No te preocupes, ponte en contacto con nosotros y encontraremos una solución
        </Text>
      )}
    </div>
  );
};