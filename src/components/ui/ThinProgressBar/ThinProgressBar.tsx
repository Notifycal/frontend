import { motion } from 'motion/react';
import type React from 'react';

interface ThinProgressBarProps {
  progress: number;
  className?: string;
}

const ThinProgressBar: React.FC<ThinProgressBarProps> = ({ progress, className = '' }) => {
  return (
    <div className={`${className} w-full h-1 bg-gray-200 z-50`}>
      <motion.div
        animate={{ width: `${progress}%` }}
        className="h-full bg-blue-500"
        initial={{ width: 0 }}
        transition={{ ease: 'easeOut', duration: 0.3 }}
      />
    </div>
  );
};

export default ThinProgressBar;
