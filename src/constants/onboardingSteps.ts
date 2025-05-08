import type { KebabCase } from '@common/types';
import type { OnboardingData, StepsCompletion } from '@our-types/onboarding';

import BusinessDetails from '@components/onboarding/BusinessDetails';
import Calendars from '@components/onboarding/Calendars';
import Confirm from '@components/onboarding/Confirm';
import ReminderType from '@components/onboarding/ReminderType';
import SenderDetails from '@components/onboarding/SenderDetails';
import TryItOut from '@components/onboarding/TryItOut';

export type StepKey = keyof OnboardingData;

export interface StepConfig {
  path: KebabCase<StepKey>;
  stepKey: StepKey;
  component: React.ComponentType;
}

export const STEPS: Array<StepConfig> = [
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
    path: 'try-it-out',
    stepKey: 'tryItOut',
    component: TryItOut
  },
  {
    path: 'confirm',
    stepKey: 'confirm',
    component: Confirm
  }
];

export const isValidStepPath = (path: string): boolean => STEPS.map((step) => step.path).includes(path);

export const getStepByIndex = (index: number): StepConfig | undefined => {
  const step = STEPS[index];
  return step;
};

export const getStepByPath = (pathToFind: KebabCase<StepKey>): StepConfig | undefined => {
  const step = STEPS.find((step) => step.path === pathToFind);
  return step;
};

export const getFirstIncompleteStepIndex = (stepsCompleted: StepsCompletion): number | undefined => {
  const index = STEPS.findIndex((step) => !stepsCompleted[step.stepKey]);
  return index > -1 ? index : undefined;
};

export const findStepIndexByPath = (pathToFind: KebabCase<StepKey>): number | undefined => {
  const index = STEPS.findIndex((step) => step.path === pathToFind);
  return index > -1 ? index : undefined;
};

export const hasIncompleteSteps = (stepsCompleted: StepsCompletion): boolean =>
  !Object.values(stepsCompleted).every((step) => step);
