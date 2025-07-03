export const tierOrder = ['good', 'better', 'best'] as const;

export const tierExtraInfo = {
  good: {
    recommended: false,
    displayName: 'Solo'
  },
  better: {
    recommended: true,
    displayName: 'Team'
  },
  best: {
    recommended: false,
    displayName: 'Pro'
  }
};
