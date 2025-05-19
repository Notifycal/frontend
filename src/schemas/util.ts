import { z } from 'zod';

export const stringArrayValidatorSchema = (
  validValues: Array<string>,
  message?: string
): z.ZodEffects<z.ZodString, string, string> => {
  const base = message ? z.string({ message }) : z.string();
  return base.refine(
    (currentValue) => (currentValue ? validValues.includes(currentValue) : false),
    message ? { message } : undefined
  );
};

export const nullableInputSchema = <T extends z.ZodTypeAny>(
  schema: T,
  message = 'Output value can not be null'
): z.ZodEffects<z.ZodNullable<T>, z.infer<T>> => {
  return schema.nullable().superRefine((value, context) => {
    if (value === null) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        fatal: true,
        message
      });
    }
  }) as z.ZodEffects<z.ZodNullable<T>, z.infer<T>>;
};
