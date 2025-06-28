import z from 'zod';

import { tierInfoSchema } from './pricing';

export const serviceConfigSchema = z.object({
  GOOGLE_CLIENT_ID: z.string().nonempty('GOOGLE_CLIENT_ID is required'),
  BACKEND_BASE_URL: z.string().url('BACKEND_BASE_URL must be a valid URL'),
  TIER_INFO: tierInfoSchema
  // STATIC_LANDING_URL: z.string().url('STATIC_LANDING_URL must be a valid URL')
});

export type ServiceConfig = z.infer<typeof serviceConfigSchema>;

let config: ServiceConfig | null = null;

export const loadServiceConfig = (): void => {
  if (config) return;

  const raw = window.globalConfig;

  if (!raw) {
    throw new Error('Service configuration is missing');
  }

  try {
    config = serviceConfigSchema.parse(raw);
  } catch {
    throw new Error('Invalid service configuration');
  }
};

export const getServiceConfig = (): ServiceConfig => {
  if (!config) {
    throw new Error('Service config not loaded.');
  }

  return config;
};
