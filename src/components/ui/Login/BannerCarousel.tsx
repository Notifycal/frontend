import { type FC, useEffect, useState } from 'react';

import { AnimatePresence, motion } from 'motion/react';

interface SlideInfo {
  title: string;
  description: string;
  icon: string;
}

interface BannerCarouselProps {
  slides: Array<SlideInfo>;
}

export const BannerCarousel: FC<BannerCarouselProps> = ({ slides }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((previous) => (previous + 1) % slides.length);
    }, 2500);

    return (): void => {
      clearInterval(timer);
    };
  }, [slides]);

  return (
    <div className="max-w-md">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          {slides[currentSlide] && (
            <div className="bg-accent1-400/20 rounded-2xl p-4 xs:p-8 backdrop-blur-sm border border-white/20 w-full">
              <div className="text-[2.5rem]">{slides[currentSlide].icon}</div>
              <h3 className="text-xl font-bold text-white">{slides[currentSlide].title}</h3>
              <p className="text-white/80 text-base leading-relaxed">{slides[currentSlide].description}</p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
