import { findStepIndexByProperty, onboardingSteps, type StepKey } from '@constants/onboardingSteps';
import type { ReminderConfigTransformed } from '@notifycal/shared/types';
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
  loadConfigFromUserProfile: (config: ReminderConfigTransformed) => void;
}

const initialState = {
  data: {},
  completedSteps: {
    businessDetails: false,
    reminderType: false,
    calendars: false,
    senderDetails: false,
    confirm: false,
    tryItOut: false,
    tierSelection: false
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

          const updatedCompletedSteps: StepsCompletion = onboardingSteps.reduce((accumulator, stepConfig, index) => {
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
      },

      loadConfigFromUserProfile: (config: ReminderConfigTransformed): void => {
        function businessDetails(business: ReminderConfigTransformed['business']): Partial<OnboardingData> {
          if (!business) return {};
          return {
            businessDetails: {
              name: business.name,
              address: business.address,
              companyIndustry: business.companyIndustry,
              companySize: business.companySize,
              language: business.language
            }
          };
        }
        function reminderType(
          template: ReminderConfigTransformed['calendars'][0]['template'] | undefined
        ): Partial<OnboardingData> {
          if (!template) return {};
          return {
            reminderType: {
              reminderId: template.id,
              reminderLanguage: template.language
            }
          };
        }
        function calendarData(calendars: ReminderConfigTransformed['calendars']): Partial<OnboardingData> {
          if (!calendars || calendars.length === 0) return {};

          return {
            calendars: { calendars },
            ...reminderType(calendars[0]?.template)
          };
        }
        function senderDetails(
          senderContact: ReminderConfigTransformed['business']['senderContact']
        ): Partial<OnboardingData> {
          if (!senderContact || senderContact.type !== 'sms') return {};
          return {
            senderDetails: { senderContact }
          };
        }

        const mappedData: Partial<OnboardingData> = {
          ...businessDetails(config.business),
          ...calendarData(config.calendars),
          ...senderDetails(config.business?.senderContact)
        };

        set({
          data: mappedData,
          completedSteps: initialState.completedSteps,
          currentStep: 0
        });
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
