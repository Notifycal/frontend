import type { BusinessDetailsValues } from '@components/ui/onboarding/BusinessDetails';
import type { CalendarsValues } from '@components/ui/onboarding/Calendars';
import type { ConfirmValues } from '@components/ui/onboarding/Confirm';
import type { ReminderTypeValues } from '@components/ui/onboarding/ReminderType';
import type { SenderDetailsValues } from '@components/ui/onboarding/SenderDetails';
import type { TryItOutValues } from '@components/ui/onboarding/TryItOut';

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
