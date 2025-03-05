import type { FunctionComponent } from '@common/types';
import { Text } from '@mantine/core';
import { phoneContactSchema } from '@notifycal/shared/schemas';
import type { PhoneNumber } from '@notifycal/shared/types';
import { Controller, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { isValidPhoneNumber } from 'react-phone-number-input';
import PhoneInput from 'react-phone-number-input/react-hook-form';
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
        render={({ field: { onChange, name, value } }) => (
          <PhoneInput
            international
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
        rules={{
          required: t('onboarding.stepSenderDetails.invalidPhoneNumber'),
          validate: (v: string) => isValidPhoneNumber(v)
        }}
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
