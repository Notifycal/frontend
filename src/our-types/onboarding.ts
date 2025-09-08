import type { KebabCase } from '@common/types';
import type { BusinessDetailsValues } from '@components/onboarding/BusinessDetails';
import type { CalendarsValues } from '@components/onboarding/Calendars';
import type { ConfirmValues } from '@components/onboarding/Confirm';
import type { ReminderTypeValues } from '@components/onboarding/ReminderType';
import type { SenderDetailsValues } from '@components/onboarding/SenderDetails';
import type { TryItOutValues } from '@components/onboarding/TryItOut';
import type { TierSelectionValues } from '@components/ui/TierSelection/TierSelection';

export interface OnboardingData {
  businessDetails: BusinessDetailsValues;
  reminderType: ReminderTypeValues;
  calendars: CalendarsValues;
  senderDetails: SenderDetailsValues;
  confirm: ConfirmValues;
  tryItOut: TryItOutValues;
  tierSelection: TierSelectionValues;
}

export interface StepsCompletion {
  businessDetails: boolean;
  reminderType: boolean;
  calendars: boolean;
  senderDetails: boolean;
  confirm: boolean;
  tryItOut: boolean;
  tierSelection: boolean;
}

export type StepKey = keyof OnboardingData;

export interface StepConfig {
  path: KebabCase<StepKey>;
  stepKey: StepKey;
  component: React.ComponentType;
  resetOnChangeBefore?: boolean;
  customWidth?: string;
  hiddenInEditMode?: boolean;
}
