import { countryData, type CountryData, type LanguageCode } from '@common/i18n';
import { TextInput, type TextInputProps } from '@mantine/core';

import { forwardRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import LanguagePicker from '../LanguagePicker/LanguagePicker';

interface PhoneInputProps extends Omit<TextInputProps, 'value' | 'onChange'> {
  label: string;
  error?: string;
  onChange?: (value: string) => void;
}

const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ label, error, onChange = (): void => {}, ...rest }, ref) => {
    const { i18n } = useTranslation();

    // Falls back to Spain if the language isn't defined
    const initialCountry = countryData[i18n.language as LanguageCode] ?? countryData.es;
    const [selectedCountry, setSelectedCountry] = useState<CountryData>(initialCountry);
    const [localNumber, setLocalNumber] = useState<string>('');

    const dialCode = selectedCountry.phoneDetails.dialCode;

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
      const inputValue = event.target.value;
      const newLocalNumber = inputValue.substring(dialCode.length + 1); // space between area code and number
      setLocalNumber(newLocalNumber);
      // Report the new full phone number back to parent
      onChange(dialCode + newLocalNumber);
    };

    const handleCountryChange = (country: CountryData): void => {
      setSelectedCountry(country);
      onChange(country.phoneDetails.dialCode + localNumber);
    };

    return (
      <TextInput
        ref={ref}
        error={error}
        label={label}
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
                handleCountryChange(country as CountryData);
              }}
            />
            <span>{dialCode}</span>
          </div>
        }
        onChange={handleInputChange}
        {...rest}
      />
    );
  }
);

export default PhoneInput;
