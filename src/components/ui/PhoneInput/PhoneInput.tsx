import { countryData, type CountryData, type LanguageCode } from '@common/i18n';
import { TextInput, type TextInputProps } from '@mantine/core';


import type { PhoneNumber } from '@notifycal/shared/types';
import { forwardRef } from 'react';
import LanguagePicker from '../LanguagePicker/LanguagePicker';

interface PhoneInputValue {
  country: LanguageCode;
  phoneNumber: PhoneNumber;
}

interface PhoneInputProps extends Omit<TextInputProps, 'value' | 'onChange'> {
  label: string;
  error?: string;
  value: PhoneInputValue;
  onChange: (value: PhoneInputValue) => void;
}

const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ label, error, value, onChange = (): void => {}, ...rest }, ref) => {
    const { country, phoneNumber } = value;
    const dialCode = countryData[country].phoneDetails.dialCode;

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
      onChange({ ...value, phoneNumber: event.currentTarget.value as PhoneNumber });
    };

    const handleCountryChange = (country: CountryData): void => {
      onChange({ ...value, country: country.code });
    };

    return (
      <TextInput
        ref={ref}
        error={error}
        label={label}
        leftSectionWidth="calc(3.2rem * var(--mantine-scale) * 2)"
        placeholder="Enter phone number"
        type="text"
        value={phoneNumber}
        leftSection={
          <div
            className="flex justify-center"
            style={{
              height: 'calc(1.875rem * var(--mantine-scale))',
              width: 'calc(2.875rem * var(--mantine-scale) * 2)'
            }}
          >
            <LanguagePicker
              displayFlagOnly
              languageData={countryData}
              value={country}
              onLanguageSelected={(selectedCountry) => {
                handleCountryChange(selectedCountry as CountryData);
              }}
            />
            <span className="text-sm">{dialCode}</span>
          </div>
        }
        onChange={handleInputChange}
        {...rest}
      />
    );
  }
);

export default PhoneInput;
