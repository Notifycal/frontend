import type { KebabCase } from '@common/types';
import type { OnboardingData, StepsCompletion } from '@our-types/onboarding';

import BusinessDetails from '@components/onboarding/BusinessDetails';
import Calendars from '@components/onboarding/Calendars';
import Confirm from '@components/onboarding/Confirm';
import ReminderType from '@components/onboarding/ReminderType';
import SenderDetails from '@components/onboarding/SenderDetails';
import TryItOut from '@components/onboarding/TryItOut';
import TierSelection from '@components/onboarding/TierSelection';

export type StepKey = keyof OnboardingData;

export interface StepConfig {
  path: KebabCase<StepKey>;
  stepKey: StepKey;
  component: React.ComponentType;
  resetOnChangeBefore?: boolean;
  customWidth?: string;
}

export const onboardingSteps: Array<StepConfig> = [
  {
    path: 'business-details',
    stepKey: 'businessDetails',
    component: BusinessDetails
  },
  {
    path: 'reminder-type',
    stepKey: 'reminderType',
    component: ReminderType
  },
  {
    path: 'calendars',
    stepKey: 'calendars',
    component: Calendars
  },
  {
    path: 'sender-details',
    stepKey: 'senderDetails',
    component: SenderDetails
  },
  {
    path: 'confirm',
    stepKey: 'confirm',
    component: Confirm,
    resetOnChangeBefore: true
  },
  {
    path: 'try-it-out',
    stepKey: 'tryItOut',
    component: TryItOut
  },
  {
    path: 'tier-selection',
    stepKey: 'tierSelection',
    component: TierSelection,
    customWidth: 'max-w-6xl' // Tailwind CSS classname
  }
];

export const isValidStepPath = (path: string): boolean => onboardingSteps.map((step) => step.path).includes(path);

export const getStepByProperty = <K extends keyof StepConfig>(key: K, value: StepConfig[K]): StepConfig | undefined => {
  return onboardingSteps.find((step) => step[key] === value);
};

export const getStepByIndex = (index: number): StepConfig | undefined => {
  const step = onboardingSteps[index];
  return step;
};

export const findStepIndexByProperty = <K extends keyof StepConfig>(
  key: K,
  value: StepConfig[K]
): number | undefined => {
  const index = onboardingSteps.findIndex((step) => step[key] === value);
  return index > -1 ? index : undefined;
};

export const getFirstIncompleteStepIndex = (stepsCompleted: StepsCompletion): number | undefined => {
  const index = onboardingSteps.findIndex((step) => !stepsCompleted[step.stepKey]);
  return index > -1 ? index : undefined;
};

export const hasIncompleteSteps = (stepsCompleted: StepsCompletion): boolean =>
  !Object.values(stepsCompleted).every((step) => step);

export const isLastStep = (stepIndex: number): boolean => stepIndex === onboardingSteps.length - 1;

export const requireOnboardingSteps = <const Keys extends ReadonlyArray<keyof OnboardingData>>(
  data: Partial<OnboardingData>,
  keys: Keys
): { [K in Keys[number]]: NonNullable<OnboardingData[K]> } => {
  const entries = keys.map((key) => {
    const value = data[key];
    if (!value) {
      throw new Error(`Missing required onboarding step: ${key}`);
    }
    return [key, value] as const;
  });

  return Object.fromEntries(entries) as {
    [K in Keys[number]]: NonNullable<OnboardingData[K]>;
  };
};
