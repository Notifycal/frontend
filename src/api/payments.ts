import type { TierId } from '@config/pricing';
import getApiClient from './common';

import type { Brand, SuccessResponseContainer } from '@notifycal/shared/types';

// TODO: extract to shared and refactor
type Url = Brand<string, 'Url'>;

export type PaymentSession = {
  url: Url;
};

export const getCheckoutURL = async (tierId: TierId): Promise<PaymentSession> => {
  try {
    const response = await getApiClient().post('/api/v1/payment-session', { tier: tierId, language: 'es' });
    const { result } = response.data as SuccessResponseContainer<PaymentSession>;
    return result;
  } catch (error) {
    throw new Error(`Something went wrong about GET api/v1/payment-session call. Error: ${JSON.stringify(error)}`);
  }
};
