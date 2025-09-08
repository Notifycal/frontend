import type { KebabCase } from '@common/types';
import type { ReminderConfigTransformed, UserStatus } from '@notifycal/shared/types';
import type { OnboardingData, StepConfig, StepKey, StepsCompletion } from '@our-types/onboarding';
import { getOnboardingState, useOnboardingStore } from '@store/useOnboardingStore';
import { useNavigate } from '@tanstack/react-router';

import BusinessDetails from '@components/onboarding/BusinessDetails';
import Calendars from '@components/onboarding/Calendars';
import Confirm from '@components/onboarding/Confirm';
import ReminderType from '@components/onboarding/ReminderType';
import SenderDetails from '@components/onboarding/SenderDetails';
import TierSelection from '@components/onboarding/TierSelection';
import TryItOut from '@components/onboarding/TryItOut';

const onboardingSteps: Array<StepConfig> = [
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
    component: TryItOut,
    hiddenInEditMode: true
  },
  {
    path: 'tier-selection',
    stepKey: 'tierSelection',
    component: TierSelection,
    customWidth: 'max-w-6xl',
    hiddenInEditMode: true
  }
];

const isEditMode = (): boolean => {
  return getOnboardingState().editMode;
};

const getOnboardingSteps = (): Array<StepConfig> => {
  const editMode = isEditMode();
  return editMode ? onboardingSteps.filter((step) => !step.hiddenInEditMode) : onboardingSteps;
};

const isValidStepPath = (path: string): boolean =>
  getOnboardingSteps()
    .map((step) => step.path)
    .includes(path);

const getStepByProperty = <K extends keyof StepConfig>(key: K, value: StepConfig[K]): StepConfig | undefined =>
  getOnboardingSteps().find((step) => step[key] === value);

const getStepByIndex = (index: number): StepConfig | undefined => getOnboardingSteps()[index];

const findStepIndexByProperty = <K extends keyof StepConfig>(key: K, value: StepConfig[K]): number | undefined => {
  const index = getOnboardingSteps().findIndex((step) => step[key] === value);
  return index > -1 ? index : undefined;
};

const getFirstIncompleteStepIndex = (stepsCompleted: StepsCompletion): number => {
  const steps = getOnboardingSteps();
  const index = steps.findIndex((step) => !stepsCompleted[step.stepKey]);
  return index > -1 ? index : steps.length - 1;
};

const getFirstIncompleteStep = (stepsCompleted: StepsCompletion): StepConfig => {
  const index = getFirstIncompleteStepIndex(stepsCompleted);
  return getStepByIndex(index)!;
};

const hasIncompleteSteps = (stepsCompleted: StepsCompletion): boolean =>
  !Object.values(stepsCompleted).every((stepCompleted) => stepCompleted);

const isLastStep = (stepIndex: number): boolean => stepIndex === getOnboardingSteps().length - 1;

const canAccessStep = (stepIndex: number, completedSteps: StepsCompletion): boolean => {
  const firstIncompleteIndex = getFirstIncompleteStepIndex(completedSteps);
  return stepIndex <= firstIncompleteIndex;
};

const requireDataFromSteps = <const Keys extends ReadonlyArray<keyof OnboardingData>>(
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

const validateOnboardingStepAccess = (
  stepPath: string,
  completedSteps: StepsCompletion
): { isValid: boolean; redirectTo?: string } => {
  const stepPathParameter = stepPath as KebabCase<StepKey>;

  if (!isValidStepPath(stepPathParameter)) {
    const firstIncompleteStepPath = getFirstIncompleteStep(completedSteps).path;
    return { isValid: false, redirectTo: firstIncompleteStepPath };
  }

  const currentStepIndex = findStepIndexByProperty('path', stepPathParameter) || 0;

  if (!canAccessStep(currentStepIndex, completedSteps)) {
    const firstIncompleteStepPath = getFirstIncompleteStep(completedSteps).path;
    return { isValid: false, redirectTo: firstIncompleteStepPath };
  }

  return { isValid: true };
};

interface OnboardingNavigation {
  handleBackNavigation: () => Promise<void>;
  handleForwardNavigation: (userStatus?: UserStatus) => Promise<void>;

  canGoBack: boolean;
  isLastStep: boolean;
  shouldAllowSelectStep: (stepIndex: number) => boolean;

  navigateToStep: (stepIndex: number) => Promise<void>;

  validateStepAccess: (stepPath: string) => { isValid: boolean; redirectTo?: string };

  handleStepSubmit: <K extends StepKey>(formData: OnboardingData[K]) => Promise<void>;
  handleStepData: <K extends StepKey>(formData: OnboardingData[K]) => void;

  onboardingData: Partial<OnboardingData>;
  currentStepIndex: number;

  onboardingSteps: Array<StepConfig>;
  currentStep: StepConfig | undefined;

  requireDataFromSteps: <const Keys extends ReadonlyArray<keyof OnboardingData>>(
    keys: Keys
  ) => { [K in Keys[number]]: NonNullable<OnboardingData[K]> };

  resetOnboarding: () => void;
  setStepData: <K extends StepKey>(step: K, data: OnboardingData[K]) => void;
  markStepAsCompleted: (step: keyof StepsCompletion) => void;
}

export function useOnboardingNavigation(): OnboardingNavigation {
  const {
    currentStep,
    completedSteps,
    data: onboardingData,
    setStepData,
    markStepAsCompleted,
    resetOnboarding
  } = useOnboardingStore();
  const navigate = useNavigate();

  const handleBackNavigation = async (): Promise<void> => {
    if (currentStep > 0) {
      const previousStep = getStepByIndex(currentStep - 1);
      if (previousStep) {
        await navigate({ to: '/onboarding/$step', params: { step: previousStep.path } });
      }
    }
  };

  const handleForwardNavigation = async (userStatus?: UserStatus): Promise<void> => {
    if (userStatus && userStatus !== 'demo') {
      await navigate({ to: '/dashboard' });
      return;
    }
    const nextStep = getStepByIndex(currentStep + 1);
    if (nextStep) {
      await navigate({ to: `/onboarding/$step`, params: { step: nextStep.path } });
    } else {
      await navigate({ to: '/onboarding/completed' });
    }
  };

  const navigateToStep = async (stepIndex: number): Promise<void> => {
    const step = getStepByIndex(stepIndex);
    if (step) {
      await navigate({ to: `/onboarding/$step`, params: { step: step.path } });
    }
  };

  const shouldAllowSelectStep = (stepIndex: number): boolean => {
    return canAccessStep(stepIndex, completedSteps);
  };

  const handleStepData = <K extends StepKey>(formData: OnboardingData[K]): void => {
    const step = getStepByIndex(currentStep);
    if (step) {
      const { stepKey } = step;
      setStepData(stepKey, formData);
      markStepAsCompleted(stepKey);
    }
  };

  const handleStepSubmit = async <K extends StepKey>(formData: OnboardingData[K]): Promise<void> => {
    handleStepData(formData);
    await handleForwardNavigation();
  };

  return {
    handleBackNavigation,
    handleForwardNavigation,

    canGoBack: currentStep > 0,
    isLastStep: isLastStep(currentStep),
    shouldAllowSelectStep,

    navigateToStep,
    validateStepAccess: (stepPath: string) => validateOnboardingStepAccess(stepPath, completedSteps),

    handleStepSubmit,
    handleStepData,

    onboardingData,
    currentStepIndex: currentStep,

    onboardingSteps: getOnboardingSteps(),
    currentStep: getStepByIndex(currentStep),

    requireDataFromSteps: <const Keys extends ReadonlyArray<keyof OnboardingData>>(
      keys: Keys
    ): { [K in Keys[number]]: NonNullable<OnboardingData[K]> } => requireDataFromSteps(onboardingData, keys),

    resetOnboarding,
    setStepData,
    markStepAsCompleted
  };
}

export const useOnboardingNavigationStatic = {
  validateStepAccess: (stepPath: string): { isValid: boolean; redirectTo?: string } => {
    const { completedSteps } = getOnboardingState();
    return validateOnboardingStepAccess(stepPath, completedSteps);
  },
  validateCompletedAccess: (): { isValid: boolean } => {
    const { completedSteps } = getOnboardingState();
    return { isValid: !hasIncompleteSteps(completedSteps) };
  },
  getStepComponent: (stepPath: string): React.ComponentType | undefined =>
    getStepByProperty('path', stepPath as KebabCase<StepKey>)?.component,
  setCurrentStepFromPath: (stepPath: string): void => {
    const index = findStepIndexByProperty('path', stepPath as KebabCase<StepKey>) || 0;
    getOnboardingState().setCurrentStep(index);
  },
  getFirstStepPath: (): string => {
    return getOnboardingSteps()[0]!.path;
  },
  hasOnboardingBeenStarted: (): boolean => {
    const { completedSteps } = getOnboardingState();
    return getFirstIncompleteStepIndex(completedSteps) !== 0;
  },
  getFirstIncompleteStepPath: (): string => {
    const { completedSteps } = getOnboardingState();
    return getFirstIncompleteStep(completedSteps).path;
  },
  loadUserProfile: (config: ReminderConfigTransformed): void => {
    getOnboardingState().loadConfigFromUserProfile(config);
  },
  setEditMode: (enabled: boolean): void => {
    getOnboardingState().setEditMode(enabled);
  }
};
