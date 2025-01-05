type AnimationValues = {
  animate: Record<string, any>;
  initial: Record<string, any>;
  transition: Record<string, any>;
};

type AnimationProperty = keyof AnimationValues;

type AnimationTarget = 'notification-bubble-full' | 'calendar' | 'reveal-tick' | 'day';
type LogoAnimatedAnimationVariants = 'default' | 'bouncy' | 'error';

export type LogoAnimationVariants = LogoAnimatedAnimationVariants | 'static';

type AnimationVariants = Record<LogoAnimatedAnimationVariants, Record<AnimationTarget, AnimationValues>>;

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
  bouncy: {},
  error: {}
};

export const getAnimationVariants = (variant: LogoAnimationVariants) => {
  return (objectId: AnimationTarget, property: AnimationProperty): AnimationValues[AnimationProperty] => {
    if (variant === 'static') {
      return {};
    }
    return animationVariants[variant][objectId][property];
  };
};
