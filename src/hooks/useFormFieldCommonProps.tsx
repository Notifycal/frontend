import { CloseButton } from '@mantine/core';
import type {
  ControllerRenderProps,
  FieldError,
  FieldPathValue,
  FieldValues,
  Path,
  UseFormRegisterReturn,
  UseFormReturn
} from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { isEqual, get } from 'radash';

interface CommonFormFieldPropsReturn {
  rightSection: React.ReactElement | undefined;
  rightSectionPointerEvents: React.CSSProperties['pointerEvents'];
  withAsterisk: true;
  error?: string;
  label?: string;
  labelProps?: Record<string, unknown> | undefined;
  placeholder?: string;
}

type FormFieldOptions<TFormValues extends FieldValues> = {
  label: string;
  placeholder?: string;
  resetValue?: FieldPathValue<TFormValues, Path<TFormValues>>;
  registration?: Partial<
    UseFormRegisterReturn<Path<TFormValues>> | ControllerRenderProps<TFormValues, Path<TFormValues>>
  >;
};

interface FormFieldCommonPropsHook<TFormValues extends FieldValues> {
  commonFormFieldProps: (
    fieldName: Path<TFormValues>,
    { label, placeholder, resetValue, registration }: FormFieldOptions<TFormValues>
  ) => CommonFormFieldPropsReturn;
}

export function useFormFieldCommonProps<TFormValues extends FieldValues>(
  methods: UseFormReturn<TFormValues>
): FormFieldCommonPropsHook<TFormValues> {
  const {
    trigger,
    setValue,
    resetField,
    watch,
    formState: { errors }
  } = methods;

  const { t } = useTranslation();

  const commonFormFieldProps = (
    fieldName: Path<TFormValues>,
    { label, placeholder, resetValue, registration }: FormFieldOptions<TFormValues>
  ): CommonFormFieldPropsReturn => {
    const fieldValue = watch(fieldName);
    const isEmptyFieldValue = !fieldValue || isEqual(fieldValue, resetValue);
    const displayClearButton = resetValue !== undefined && !isEmptyFieldValue;

    const fieldMessageObject = get<FieldError>(errors, fieldName);

    return {
      rightSection: displayClearButton ? (
        <CloseButton
          aria-label={t('generic.clear')}
          size="sm"
          style={{ display: !isEmptyFieldValue ? undefined : 'none' }}
          onClick={async () => {
            setValue(fieldName, resetValue);
            await trigger(fieldName);
          }}
        />
      ) : undefined,
      rightSectionPointerEvents: displayClearButton ? 'all' : undefined,
      withAsterisk: true,
      label,
      labelProps: label ? { pb: '.4em' } : undefined,
      placeholder,
      ...(registration ? registration : {}),
      error: fieldMessageObject && fieldMessageObject['message']
    };
  };

  return { commonFormFieldProps };
}
