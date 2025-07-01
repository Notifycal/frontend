import z from 'zod';

import type { SnakeToCamelObject } from '@common/types';
import { camel, mapKeys } from 'radash';

const snakeToCamelObjectKeys = <T extends Record<string, unknown>>(object: T): SnakeToCamelObject<T> =>
  mapKeys(object, (key) => camel(key)) as SnakeToCamelObject<T>;

const tierDetailsRawSchema = z
  .object({
    name: z.enum(['good', 'better', 'best']),
    /* eslint-disable camelcase */
    price_eur: z.number(),
    price_id: z.string(),
    product_id: z.string(),
    number_of_reminders: z.number()
    /* eslint-enable camelcase */
  })
  .transform(snakeToCamelObjectKeys);

const tierInfoInnerSchema = z.object({
  good: tierDetailsRawSchema,
  better: tierDetailsRawSchema,
  best: tierDetailsRawSchema
});

export const tierInfoSchema = z.string().transform((data, context) => {
  try {
    const parsed = JSON.parse(data);
    return tierInfoInnerSchema.parse(parsed);
  } catch {
    context.addIssue({ code: 'custom', message: 'Invalid tier info object' });
    return z.NEVER;
  }
});

export type TierId = keyof z.input<typeof tierInfoInnerSchema>;
export type TierDetails = z.infer<typeof tierDetailsRawSchema>;
export type TierInfoMap = {
  [K in TierId]: TierDetails;
};
