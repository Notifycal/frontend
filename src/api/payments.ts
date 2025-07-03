import type { TierId, Url , SuccessResponseContainer } from '@notifycal/shared/types';
import getApiClient from './common';

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
