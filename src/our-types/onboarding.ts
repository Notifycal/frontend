import type { BusinessDetailsValues } from '@components/onboarding/BusinessDetails';
import type { CalendarsValues } from '@components/onboarding/Calendars';
import type { ConfirmValues } from '@components/onboarding/Confirm';
import type { ReminderTypeValues } from '@components/onboarding/ReminderType';
import type { SenderDetailsValues } from '@components/onboarding/SenderDetails';
import type { TryItOutValues } from '@components/onboarding/TryItOut';

// Combined form data for all steps
export interface OnboardingData {
  businessDetails: BusinessDetailsValues;
  reminderType: ReminderTypeValues;
  calendars: CalendarsValues;
  senderDetails: SenderDetailsValues;
  confirm: ConfirmValues;
  tryItOut: TryItOutValues;
}

// Step completion status
export interface StepsCompletion {
  businessDetails: boolean;
  reminderType: boolean;
  calendars: boolean;
  senderDetails: boolean;
  confirm: boolean;
  tryItOut: boolean;
}
