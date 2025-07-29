import type { NotifycalTFunction } from '@common/i18n';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo } from 'react';
import { useForm, type FieldValues, type UseFormProps, type UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

// Workaround while we update to Zod 4
interface Zod3Type<O = unknown, I = unknown> {
  _output: O;
  _input: I;
  _def: {
    typeName: string;
  };
}

type SchemaBuilder<TFormInput, TFormOutput> = (t: NotifycalTFunction) => Zod3Type<TFormOutput, TFormInput>;

// Replicating react-hook-form useForm signature generics (including order)
export function useI18nForm<
  TFormInput extends FieldValues,
  TFormContext = unknown,
  TFormOutput extends FieldValues = TFormInput
>(
  schemaBuilder: SchemaBuilder<TFormInput, TFormOutput>,
  formProps: Omit<UseFormProps<TFormInput, TFormContext, TFormOutput>, 'resolver'>,
  t: NotifycalTFunction
): UseFormReturn<TFormInput, TFormContext, TFormOutput> {
  const { i18n } = useTranslation();

  const schema = useMemo(() => schemaBuilder(t), [schemaBuilder, t]);

  const methods = useForm<TFormInput, TFormContext, TFormOutput>({
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
