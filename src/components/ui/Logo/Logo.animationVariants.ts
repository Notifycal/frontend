type AnimationValues = {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  animate: Record<string, any>;
  initial?: Record<string, any>;
  transition: Record<string, any>;
  /* eslint-enable @typescript-eslint/no-explicit-any */
};

type AnimationProperty = keyof AnimationValues;

type AnimationTarget = 'notification-bubble-full' | 'calendar' | 'reveal-tick' | 'day' | 'full-svg';
type LogoAnimatedAnimationVariants = 'default' | 'bouncy' | 'error';

export type LogoAnimationVariants = LogoAnimatedAnimationVariants | 'static';

type AnimationVariants = Record<LogoAnimatedAnimationVariants, Partial<Record<AnimationTarget, AnimationValues>>>;

const animationVariants: AnimationVariants = {
  default: {
    'notification-bubble-full': {
      initial: { translateX: -50 },
      animate: { translateX: 0 },
      transition: {
        translateX: {
          type: 'spring',
          stiffness: 100,
          damping: 10
        }
      }
    },
    calendar: {
      animate: { translateY: 0 },
      initial: { translateY: -50 },
      transition: {
        translateY: {
          type: 'spring',
          stiffness: 100,
          duration: 2,
          damping: 10
        }
      }
    },
    'reveal-tick': {
      initial: { x: -200 },
      animate: { x: 0 },
      transition: {
        delay: 3,
        duration: 5,
        ease: 'easeInOut'
      }
    },
    day: {
      initial: { translateY: -50 },
      animate: { translateY: 0 },
      transition: {
        translateY: {
          type: 'spring',
          stiffness: 100,
          damping: 10
        }
      }
    }
  },
  bouncy: {
    'full-svg': {
      animate: {
        y: ['-0.5rem', '1rem'],
        scale: ['90%', '110%']
      },
      transition: {
        y: {
          duration: 0.8,
          repeat: Infinity,
          ease: 'easeIn',
          repeatType: 'reverse'
        },
        scale: {
          duration: 1.6,
          repeat: Infinity,
          ease: 'easeOut',
          repeatType: 'reverse'
        }
      }
    }
  },
  error: {}
};

export const getAnimationVariants = (variant: LogoAnimationVariants) => {
  return (objectId: AnimationTarget, property: AnimationProperty): AnimationValues[AnimationProperty] => {
    if (variant !== 'static' && animationVariants[variant] && animationVariants[variant][objectId]) {
      return animationVariants[variant][objectId][property];
    }

    return {};
  };
};
