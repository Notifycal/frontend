import { motion } from 'motion/react';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';

interface UsageBarProps {
  usage: {
    remaining: number;
    total: number;
  };
}

const UsageBar: FC<UsageBarProps> = ({ usage: { remaining, total } }) => {
  const { t } = useTranslation();
  const percentage = (remaining / total) * 100;
  const used = total - remaining;

  return (
    <div className="w-full flex flex-col gap-2 py-4">
      <div className="relative w-full h-6 rounded-lg border-1 border-gray-500 bg-gradient-to-r from-red-600 from-0% via-yellow-400 via-15% to-green-300 to-50%">
        <motion.div
          animate={{ width: `${100 - percentage}%` }}
          className="absolute top-0 right-0 h-full bg-gray-300 "
          initial={{ width: '100%' }}
          transition={{ type: 'spring', stiffness: 120, damping: 20 }}
        />
      </div>

      <div className="text-sm text-gray-700 flex justify-between">
        <span>{t('generic.remaining', { credits: remaining })}</span>
        <span>{t('generic.used', { credits: used })}</span>
      </div>
    </div>
  );
};

export default UsageBar;
