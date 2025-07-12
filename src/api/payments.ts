import type { TierId, TopupId, Url, SuccessResponseContainer } from '@notifycal/shared/types';
import getApiClient from './common';

export type PaymentSession = {
  url: Url;
};

export type CustomerPortal = {
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

export const getTopupCheckoutURL = async (topupId: TopupId): Promise<PaymentSession> => {
  try {
    const response = await getApiClient().post('/api/v1/payment-session', { topup: topupId, language: 'es' });
    const { result } = response.data as SuccessResponseContainer<PaymentSession>;
    return result;
  } catch (error) {
    throw new Error(`Something went wrong about GET api/v1/payment-session call. Error: ${JSON.stringify(error)}`);
  }
};

export const getCustomerPortalURL = async (): Promise<CustomerPortal> => {
  try {
    const response = await getApiClient().post('/api/v1/customer-portal-session');
    const { result } = response.data as SuccessResponseContainer<CustomerPortal>;
    return result;
  } catch (error) {
    throw new Error(`Something went wrong about GET api/v1/payment-session call. Error: ${JSON.stringify(error)}`);
  }
};
