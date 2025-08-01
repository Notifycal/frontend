import { z } from 'zod';

export const stringArrayValidatorSchema = (validValues: Array<string>, message?: string): z.ZodString => {
  const base = message ? z.string({ message }) : z.string();
  return base.refine(
    (currentValue) => (currentValue ? validValues.includes(currentValue) : false),
    message ? { message } : undefined
  );
};

export function nullableInputSchema<TInputSchema extends z.ZodTypeAny>(
  schema: TInputSchema,
  message = 'Output value can not be null'
): z.ZodType<z.infer<typeof schema>, z.infer<typeof schema> | null> {
  return schema
    .nullable()
    .superRefine((value, context): void => {
      if (value === null) {
        context.addIssue({
          code: 'custom',
          fatal: true,
          message
        });
      }
      return;
    })
    .transform((v) => v!) as z.ZodType<z.infer<typeof schema>, z.infer<typeof schema> | null>;
}
