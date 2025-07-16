import { motion } from 'motion/react';
import type { FC } from 'react';

interface UsageBarProps {
  usage: {
    remaining: number;
    total: number;
  };
}

const UsageBar: FC<UsageBarProps> = ({ usage: { remaining, total } }) => {
  const percentage = (remaining / total) * 100;
  const used = total - remaining;

  return (
    <div className="w-full flex flex-col gap-2 py-4">
      {/* Track base con gradiente completo */}
      <div
        className="relative w-full h-6 rounded-lg border-1 border-gray-500 shadow-2xl shadow-amber-200"
        style={{
          background: 'linear-gradient(90deg, #ef4444 0%, #facc15 15%, #22c55e 50%)' // rojo→amarillo→verde
        }}
      >
        {/* Overlay gris que cubre la parte restante */}
        <motion.div
          animate={{ width: `${100 - percentage}%` }}
          className="absolute top-0 right-0 h-full bg-gray-300 "
          initial={{ width: '100%' }}
          transition={{ type: 'spring', stiffness: 120, damping: 20 }}
        />
      </div>

      {/* Numeric labels */}
      <div className="text-sm text-gray-700 flex justify-between">
        <span>{remaining} restantes</span>
        <span>{used} usados</span>
      </div>
    </div>
  );
};

export default UsageBar;
