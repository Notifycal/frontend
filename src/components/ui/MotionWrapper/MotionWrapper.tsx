import { motion } from 'motion/react';
import type React from 'react';

const pageTransition = {
  initial: { opacity: 0, y: 50 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -50 },
  transition: { duration: 0.5 }
};

export const MotionWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <motion.div
      animate="animate"
      exit="exit"
      initial="initial"
      style={{ position: 'relative' }}
      variants={pageTransition}
    >
      {children}
    </motion.div>
  );
};
