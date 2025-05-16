import { findStepIndexByProperty, STEPS, type StepKey } from '@constants/onboardingSteps';
import type { OnboardingData, StepsCompletion } from '@our-types/onboarding';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface OnboardingState {
  // State
  data: Partial<OnboardingData>;
  completedSteps: StepsCompletion;
  currentStep: number;

  // Actions
  setStepData: <K extends StepKey>(step: K, data: OnboardingData[K]) => void;
  markStepAsCompleted: (step: keyof StepsCompletion) => void;
  setCurrentStep: (step: number) => void;
  resetOnboarding: () => void;
}

const initialState = {
  data: {},
  completedSteps: {
    businessDetails: false,
    reminderType: false,
    calendars: false,
    senderDetails: false,
    confirm: false,
    tryItOut: false
  },
  currentStep: 0
};

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      ...initialState,

      setStepData: (step, data): void => {
        set((state) => {
          const newData = {
            ...state.data,
            [step]: data
          };

          const changedStepIndex = findStepIndexByProperty('stepKey', step);

          const updatedCompletedSteps: StepsCompletion = STEPS.reduce((accumulator, stepConfig, index) => {
            const shouldInvalidate =
              stepConfig.resetOnChangeBefore && changedStepIndex !== undefined && index > changedStepIndex;
            return {
              ...accumulator,
              [stepConfig.stepKey]: shouldInvalidate ? false : state.completedSteps[stepConfig.stepKey]
            };
          }, state.completedSteps);

          return { data: newData, completedSteps: updatedCompletedSteps };
        });
      },

      markStepAsCompleted: (step): void => {
        set((state) => {
          const newCompletedSteps = {
            ...state.completedSteps,
            [step]: true
          };

          return { completedSteps: newCompletedSteps };
        });
      },

      setCurrentStep: (step): void => {
        set({ currentStep: step });
      },

      resetOnboarding: (): void => {
        // Clear zustand-managed localStorage
        useOnboardingStore.persist.clearStorage();
        // reset initial state
        set(initialState);
      }
    }),
    {
      name: 'onboarding',
      partialize: (state) => ({
        completedSteps: state.completedSteps,
        data: state.data
      })
    }
  )
);
