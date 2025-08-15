import { useEffect, useState, type JSX } from 'react';

import { AnimatePresence, motion } from 'motion/react';

interface CarouselSlide {
  readonly title: string;
  readonly description: string;
  readonly icon: string;
}

const carouselImages: Array<CarouselSlide> = [
  {
    title: 'Streamline Your Workflow',
    description: 'Automate appointment reminders and never miss a client again',
    icon: '📅'
  },
  {
    title: 'Boost Customer Satisfaction',
    description: 'Keep your clients informed and reduce no-shows significantly',
    icon: '⭐'
  },
  {
    title: 'Save Time & Money',
    description: 'Reduce manual work and focus on what matters most',
    icon: '💰'
  }
];

export const BannerCarousel = (): JSX.Element => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((previous) => (previous + 1) % carouselImages.length);
    }, 2500);

    return (): void => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div className="w-full max-w-lg">
      <div className="relative h-60 lg:h-80">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            animate={{ opacity: 1, y: 0 }}
            className="absolute inset-0 flex flex-col items-center justify-center"
            exit={{ opacity: 0, y: -20 }}
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-white/10 rounded-2xl p-8 backdrop-blur-sm border border-white/20 w-full">
              <div className="text-6xl mb-6">{carouselImages[currentSlide]?.icon}</div>
              <h3 className="text-2xl font-bold text-white mb-4">{carouselImages[currentSlide]?.title}</h3>
              <p className="text-white/80 text-lg leading-relaxed">{carouselImages[currentSlide]?.description}</p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex justify-center mt-6 lg:mt-8 space-x-2">
        {carouselImages.map((_, index) => (
          <button
            key={index}
            aria-label={`Go to slide ${index + 1}`}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide ? 'bg-white' : 'bg-white/40'
            }`}
            onClick={() => {
              setCurrentSlide(index);
            }}
          />
        ))}
      </div>
    </div>
  );
};
