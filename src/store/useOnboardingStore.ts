import type { ReminderConfigTransformed } from '@notifycal/shared/types';
import type { OnboardingData, StepKey, StepsCompletion } from '@our-types/onboarding';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface OnboardingState {
  // State
  data: Partial<OnboardingData>;
  completedSteps: StepsCompletion;
  currentStep: number;
  editMode: boolean;

  // Actions
  setStepData: <K extends StepKey>(step: K, data: OnboardingData[K]) => void;
  markStepAsCompleted: (step: keyof StepsCompletion) => void;
  setCurrentStep: (step: number) => void;
  setEditMode: (editMode: boolean) => void;
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
  currentStep: 0,
  editMode: false
};

const _useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      ...initialState,

      setStepData: (step, data): void => {
        set((state) => {
          const newData = {
            ...state.data,
            [step]: data
          };

          return { data: newData };
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

      setEditMode: (editMode): void => {
        set({ editMode });
      },

      resetOnboarding: (): void => {
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
          completedSteps: {
            businessDetails: true,
            reminderType: true,
            calendars: true,
            senderDetails: true,
            confirm: true,
            tryItOut: true,
            tierSelection: true
          },
          currentStep: 0
        });
      }
    }),
    {
      name: 'onboarding',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        completedSteps: state.completedSteps,
        data: state.data,
        currentStep: state.currentStep
      })
    }
  )
);

const useEditModeStore = create<{ editMode: boolean; setEditMode: (editMode: boolean) => void }>()(
  persist(
    (set) => ({
      editMode: false,
      setEditMode: (editMode: boolean): unknown => set({ editMode })
    }),
    {
      name: 'onboarding-edit-mode',
      storage: createJSONStorage(() => sessionStorage)
    }
  )
);

const useOnboardingStore = (): OnboardingState => {
  const mainStore = _useOnboardingStore();
  const editStore = useEditModeStore();

  return {
    ...mainStore,
    editMode: editStore.editMode,
    setEditMode: editStore.setEditMode
  };
};

const getOnboardingState = (): OnboardingState => {
  const mainState = _useOnboardingStore.getState();
  const editState = useEditModeStore.getState();

  return {
    ...mainState,
    editMode: editState.editMode,
    setEditMode: editState.setEditMode
  };
};
export { getOnboardingState, useOnboardingStore };
export type { OnboardingState };
