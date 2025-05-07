import { CloseButton } from '@mantine/core';
import type {
  ControllerRenderProps,
  FieldPathValue,
  FieldValues,
  Path,
  UseFormRegisterReturn,
  UseFormReturn
} from 'react-hook-form';
import { useTranslation } from 'react-i18next';


interface CommonFormFieldPropsReturn {
  rightSection: React.ReactElement | undefined;
  rightSectionPointerEvents: React.CSSProperties['pointerEvents'];
  withAsterisk: true;
  error?: string;
  label: string;
  placeholder?: string;
}

type FormFieldOptions<TFormValues extends FieldValues> = {
  label: string;
  placeholder?: string;
  resetValue: FieldPathValue<TFormValues, Path<TFormValues>>;
  registration?: Partial<UseFormRegisterReturn<Path<TFormValues>> | ControllerRenderProps<TFormValues, Path<TFormValues>>>;
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
    getValues,
    formState: { errors }
  } = methods;

  const { t } = useTranslation();

  const commonFormFieldProps = (
    fieldName: Path<TFormValues>,
    { label, placeholder, resetValue, registration }: FormFieldOptions<TFormValues>
  ): CommonFormFieldPropsReturn => {
    const fieldValue = getValues(fieldName);

    return {
      rightSection: fieldValue ? (
        <CloseButton
          aria-label={t('generic.clear')}
          style={{ display: fieldValue ? undefined : 'none' }}
          onClick={async () => {
            setValue(fieldName, resetValue);
            await trigger(fieldName);
          }}
        />
      ) : undefined,
      rightSectionPointerEvents: 'all',
      withAsterisk: true,
      label,
      placeholder,
      ...(registration ? registration : {}),
      error: errors[fieldName] && (errors[fieldName].message as string)
    };
  };

  return { commonFormFieldProps };
}
