import { tierMapSchema, topupMapSchema } from '@notifycal/shared/schemas';

import z from 'zod';

const pricingSchema = z.object({
  tiers: tierMapSchema,
  topups: topupMapSchema
});

export const tierInfoSchema = z.string().transform((data, context) => {
  try {
    const jsonParsed = JSON.parse(data);
    return pricingSchema.parse(jsonParsed);
  } catch {
    context.addIssue({ code: 'custom', message: 'Invalid tier info object' });
    return z.NEVER;
  }
});
