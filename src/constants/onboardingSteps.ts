import type { KebabCase } from '@common/types';

import BusinessDetails from '@components/onboarding/BusinessDetails';
import Calendars from '@components/onboarding/Calendars';
import Confirm from '@components/onboarding/Confirm';
import ReminderType from '@components/onboarding/ReminderType';
import SenderDetails from '@components/onboarding/SenderDetails';
import TryItOut from '@components/onboarding/TryItOut';

import type { OnboardingData, StepsCompletion } from '@our-types/onboarding';

export type StepKey = keyof OnboardingData;

export type OnboardingTitleKey<K extends StepKey> = `${K & string}.title`;
export type OnboardingDescriptionKey<K extends StepKey> = `${K & string}.subtitle`;

export interface StepConfig {
  path: KebabCase<StepKey>;
  stepKey: StepKey;
  title: OnboardingTitleKey<StepKey>;
  description: OnboardingDescriptionKey<StepKey>;
  component: React.ComponentType;
  hideStepper?: boolean;
}

export const STEPS: Array<StepConfig> = [
  {
    path: 'business-details',
    stepKey: 'businessDetails',
    title: 'businessDetails.title',
    description: 'businessDetails.subtitle',
    component: BusinessDetails
  },
  {
    path: 'reminder-type',
    stepKey: 'reminderType',
    title: 'reminderType.title',
    description: 'reminderType.subtitle',
    component: ReminderType
  },
  {
    path: 'calendars',
    stepKey: 'calendars',
    title: 'calendars.title',
    description: 'calendars.subtitle',
    component: Calendars
  },
  {
    path: 'sender-details',
    stepKey: 'senderDetails',
    title: 'senderDetails.title',
    description: 'senderDetails.subtitle',
    component: SenderDetails
  },
  {
    path: 'try-it-out',
    stepKey: 'tryItOut',
    title: 'tryItOut.title',
    description: 'tryItOut.subtitle',
    component: TryItOut
  },
  {
    path: 'confirm',
    stepKey: 'confirm',
    title: 'confirm.title',
    description: 'confirm.subtitle',
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

export const hasIncompleteSteps = (stepsCompleted: StepsCompletion): boolean => !Object.values(stepsCompleted).every((step) => step)
