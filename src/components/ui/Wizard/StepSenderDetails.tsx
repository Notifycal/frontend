import { countryData, isValidMobilePhoneNumber, type CountryData, type LanguageCode } from '@common/i18n';
import type { FunctionComponent } from '@common/types';
import { TextInput } from '@mantine/core';
import type { PhoneNumber } from '@notifycal/shared/types';
import { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import 'react-phone-number-input/style.css';
import { z } from 'zod';
import LanguagePicker from '../LanguagePicker/LanguagePicker';
import PhoneInput from '../PhoneInput/PhoneInput';
import type { Step } from './Wizard';

const StepSenderDetailsSchema = z
  .object({
    contactDetails: z.object({
      type: z.literal('phone'),
      identifier: z.string().min(5, { message: 'Phone number is required' })
    })
  })
  .refine(
    (data) => {
      return isValidMobilePhoneNumber(data.contactDetails.identifier as PhoneNumber, 'es');
    },
    { message: 'Invalid phone number', path: ['contactDetails', 'identifier'] }
  );

// const StepSenderDetailsSchema = z.object({ contactDetails: phoneContactSchema });
export type StepSenderDetailsValues = z.infer<typeof StepSenderDetailsSchema>;
const StepSenderDetailsComponent = (): FunctionComponent => {
  const { t, i18n } = useTranslation();
  const {
    register,
    watch,
    control,
    formState: { errors }
  } = useFormContext<StepSenderDetailsValues>();

  const initialCountry = countryData[i18n.language as LanguageCode] ?? countryData.es;
  const [selectedCountry, setSelectedCountry] = useState<CountryData>(initialCountry);
  const { dialCode } = selectedCountry.phoneDetails;

  

  // This return (Custom component) works worse
  return (
    <Controller
      control={control}
      name="contactDetails.identifier"
      render={({ field: { onChange } }) => (
        <PhoneInput
          error={errors.contactDetails?.identifier?.message}
          label={t('onboarding.stepSenderDetails.msg1')}
          // value={value}
          {...register('contactDetails.identifier')}
          onChange={onChange}
        />
      )}
    />
  );

  // This return (same than above but exploded) works better
  return (
    <TextInput
      error={errors.contactDetails?.identifier?.message}
      {...register('contactDetails.identifier')}
      label={t('onboarding.stepSenderDetails.msg1')}
      leftSectionWidth="calc(3.2rem * var(--mantine-scale) * 2)"
      placeholder="Enter phone number"
      type="text"
      leftSection={
        <div
          className="relative inline-flex justify-center"
          style={{
            height: 'calc(1.875rem * var(--mantine-scale))',
            width: 'calc(2.875rem * var(--mantine-scale) * 2)'
          }}
        >
          <LanguagePicker
            displayFlagOnly
            languageData={countryData}
            onLanguageSelected={(country) => {
              console.log('lang changed');
              console.log(country);
              setSelectedCountry(country as CountryData);
            }}
          />
          <span>{dialCode}</span>
        </div>
      }
    />
  );
};
export const StepSenderDetails: Step<typeof StepSenderDetailsSchema> = {
  component: StepSenderDetailsComponent,
  schema: StepSenderDetailsSchema,
  defaultValues: { contactDetails: { type: 'phone', identifier: '' as PhoneNumber } }
};
