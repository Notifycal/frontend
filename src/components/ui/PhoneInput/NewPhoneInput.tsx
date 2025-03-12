import { Checkbox, TextInput, type TextInputProps } from '@mantine/core';
import { forwardRef } from 'react';

interface NewPhoneInputValue {
  checked: boolean;
  number: string;
}

// interface PhoneInputProps
//   extends TextInputProps,
//     Omit<React.ComponentPropsWithoutRef<typeof TextInput>, keyof TextInputProps> {
interface PhoneInputProps extends Omit<TextInputProps, 'leftSection' | 'value' | 'onChange'> {
  label: string;
  error?: string;
  value: NewPhoneInputValue;
  onChange: (value: NewPhoneInputValue) => void;
}

const NewPhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ label, error, value, onChange, ...inputProps }, ref) => {
    console.log(error);

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
      onChange({ ...value, checked: event.currentTarget.checked });
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
      onChange({ ...value, number: event.currentTarget.value });
    };

    return (
      <>
        <TextInput
          ref={ref}
          error={error}
          label={label}
          leftSection={<Checkbox checked={value.checked} onChange={handleCheckboxChange} />}
          value={value.number}
          onChange={handleInputChange}
          {...inputProps}
        />
      </>
    );
  }
);

export default NewPhoneInput;
