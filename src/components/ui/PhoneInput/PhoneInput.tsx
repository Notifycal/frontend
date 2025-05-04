import { phoneData } from '@common/i18n';
import { TextInput, type TextInputProps } from '@mantine/core';
import type { CountryCode, CountryName, InternationalizationData, PhoneNumber } from '@notifycal/shared/types';
import { forwardRef } from 'react';
import InternationalizationPicker from '../InternationalizationPicker/InternationalizationPicker';

interface PhoneInputValue {
  type: 'phone';
  countryCode: CountryCode;
  phoneNumber: PhoneNumber;
}

interface PhoneInputProps extends Omit<TextInputProps, 'value' | 'onChange'> {
  label: string;
  error?: string;
  value: PhoneInputValue;
  onChange: (value: PhoneInputValue) => void;
  placeholder?: string;
}

const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ label, placeholder, error, value, onChange = (): void => {}, ...rest }, ref) => {
    const { countryCode: country, phoneNumber } = value;
    const dialCode = phoneData[country].phoneDetails.dialCode;

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
      onChange({ ...value, phoneNumber: event.currentTarget.value as PhoneNumber });
    };

    const handleCountryChange = (country: InternationalizationData<CountryCode, CountryName>): void => {
      onChange({ ...value, countryCode: country.code, phoneNumber: '' as PhoneNumber });
    };

    return (
      <TextInput
        ref={ref}
        error={error}
        label={label}
        labelProps={{ pb: 'sm' }}
        leftSectionWidth="calc(3.2rem * var(--mantine-scale) * 2)"
        placeholder={placeholder}
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
            <InternationalizationPicker
              displayFlagOnly
              data={phoneData}
              value={country}
              onSelected={(selectedCountry) => {
                handleCountryChange(selectedCountry);
              }}
            />
            <span className="ml-2 text-sm self-center">{dialCode}</span>
          </div>
        }
        onChange={handleInputChange}
        {...rest}
      />
    );
  }
);

export default PhoneInput;
