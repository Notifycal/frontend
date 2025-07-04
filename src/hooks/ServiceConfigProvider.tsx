import { createContext, useContext, type ReactNode } from 'react';

import type { z } from 'zod';

import type { FunctionComponent } from '@common/types';
import { serviceConfigSchema } from '@config/serviceConfig';

export type ServiceConfig = z.infer<typeof serviceConfigSchema>;

const validateServiceConfig = (config: unknown): ServiceConfig => {
  try {
    return serviceConfigSchema.parse(config);
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
