import z from 'zod';

import { productsInfoSchema } from '@notifycal/shared/pricing';
import { serviceConfigFactory } from '@notifycal/shared/utils';

export const serviceConfigSchema = z.object({
  GOOGLE_CLIENT_ID: z.string().nonempty('GOOGLE_CLIENT_ID is required'),
  BACKEND_BASE_URL: z.url('BACKEND_BASE_URL must be a valid URL'),
  TIER_INFO: productsInfoSchema, // TODO: this var should not be called TIER_INFO cause it also contains PRODUCTS_INFO
  STATIC_LANDING_URL: z.url('STATIC_LANDING_URL must be a valid URL').default('https://notifycal.com')
});

export type ServiceConfig = z.infer<typeof serviceConfigSchema>;

const { loadServiceConfig, getServiceConfig } = serviceConfigFactory(serviceConfigSchema);

export { getServiceConfig, loadServiceConfig };
