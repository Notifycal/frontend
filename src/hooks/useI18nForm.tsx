import type { NotifycalTFunction } from '@common/i18n';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo } from 'react';
import { useForm, type FieldValues, type UseFormProps, type UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import type { ZodType, ZodTypeDef } from 'zod';

type SchemaBuilder<TFormValues extends FieldValues> = (
  t: NotifycalTFunction
) => ZodType<TFormValues, ZodTypeDef, unknown>;

export function useI18nForm<TFormValues extends FieldValues>(
  schemaBuilder: SchemaBuilder<TFormValues>,
  formProps: Omit<UseFormProps<TFormValues>, 'resolver'>,
  t: NotifycalTFunction
): UseFormReturn<TFormValues> {
  const { i18n } = useTranslation();

  const schema = useMemo(() => schemaBuilder(t), [schemaBuilder, t]);

  const methods = useForm<TFormValues>({
    ...formProps,
    resolver: zodResolver(schema)
  });

  const reset = methods.reset;

  useEffect(() => {
    void i18n.language;
    reset(undefined, { keepValues: true });
  }, [i18n.language, reset]);

  return methods;
}
