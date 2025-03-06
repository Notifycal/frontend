import type { FunctionComponent } from '@common/types';
import { Text } from '@mantine/core';
import { phoneContactSchema } from '@notifycal/shared/schemas';
import type { PhoneNumber } from '@notifycal/shared/types';
import { Controller, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { isValidPhoneNumber } from 'react-phone-number-input';
import PhoneInputWithCountry from 'react-phone-number-input/react-hook-form';
import 'react-phone-number-input/style.css';
import { z } from 'zod';
import type { Step } from './Wizard';

const StepSenderDetailsSchema = z.object({
  contactDetails: phoneContactSchema
});
export type StepSenderDetailsValues = z.infer<typeof StepSenderDetailsSchema>;
const StepSenderDetailsComponent = (): FunctionComponent => {
  const { t } = useTranslation();
  const {
    control,
    formState: { errors }
  } = useFormContext<StepSenderDetailsValues>();

  return (
    <>
      <Text pb="sm" size="sm">
        {t('onboarding.stepSenderDetails.msg1')}
      </Text>
      <Controller
        control={control}
        name="contactDetails.identifier"
        rules={{ required: true, validate: (v) => isValidPhoneNumber(v) }}
        render={({ field: { onChange, name, value } }) => (
          <PhoneInputWithCountry
            international
            className="flex gap-3 border rounded-lg p-2 w-full"
            countries={['ES']}
            country="ES"
            countryCallingCodeEditable={false}
            defaultCountry="ES"
            error={errors['contactDetails']?.identifier?.message}
            locales={['ES', 'EN']}
            name={name}
            placeholder="   666 77 88 99"
            value={value}
            withCountryCallingCode={false}
            onChange={(v: string) => {
              onChange(v as PhoneNumber);
            }}
          />
        )}
      />
    </>
  );
};
export const StepSenderDetails: Step<typeof StepSenderDetailsSchema> = {
  component: StepSenderDetailsComponent,
  schema: StepSenderDetailsSchema,
  defaultValues: {
    contactDetails: {
      type: 'phone',
      identifier: '' as PhoneNumber
    }
  }
};
