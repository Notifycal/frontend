import { createContext, useContext, type ReactNode } from 'react';

import { z } from 'zod';

import type { FunctionComponent } from '@common/types';

export const ServiceConfigSchema = z.object({
  GOOGLE_CLIENT_ID: z.string().nonempty('GOOGLE_CLIENT_ID is required'),
  BACKEND_BASE_URL: z.string().url('BACKEND_BASE_URL must be a valid URL'),
  STATIC_LANDING_URL: z.string().url('STATIC_LANDING_URL must be a valid URL')
});

export type ServiceConfig = z.infer<typeof ServiceConfigSchema>;

const validateServiceConfig = (config: unknown): ServiceConfig => {
  try {
    return ServiceConfigSchema.parse(config);
  } catch (error) {
    // TODO: Only show this for development
    console.error('Invalid service configuration:', error);
    throw new Error('Service configuration is invalid');
  }
};

const ServiceConfigContext = createContext<ServiceConfig | null>(null);

export const ServiceConfigProvider = ({ children }: { children: ReactNode }): FunctionComponent => {
  if (!window.globalConfig) {
    throw new Error('Service configuration is missing!');
  }

  const config = validateServiceConfig(window.globalConfig);

  return <ServiceConfigContext.Provider value={config}>{children}</ServiceConfigContext.Provider>;
};

export const useServiceConfig = (): ServiceConfig => {
  const context = useContext(ServiceConfigContext);

  if (!context) {
    throw new Error('useServiceConfig must be used within a ServiceConfigProvider');
  }

  return context;
};
