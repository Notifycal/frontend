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
    <div className="max-w-lg">
      <div className="h-60 lg:h-80">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
          >
            {slides[currentSlide] && (
              <div className="bg-white/10 rounded-2xl p-8 backdrop-blur-sm border border-white/20 w-full">
                <div className="text-6xl mb-6">{slides[currentSlide].icon}</div>
                <h3 className="text-2xl font-bold text-white mb-4">{slides[currentSlide].title}</h3>
                <p className="text-white/80 text-lg leading-relaxed">{slides[currentSlide].description}</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
