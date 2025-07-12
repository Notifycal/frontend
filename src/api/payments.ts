import type { TierId, TopupId, Url, SuccessResponseContainer, Topup } from '@notifycal/shared/types';
import getApiClient from './common';

type RedirectUrlSession = { url: Url };

export type PaymentSession = RedirectUrlSession;
export type CustomerPortalSession = RedirectUrlSession;

type CheckoutPayload = { tier: TierId, topup?: never } | { topup: TopupId, tier?: never }

export const getProductCheckoutURL = async (productPayload: CheckoutPayload): Promise<PaymentSession> => {
  try {
    const response = await getApiClient().post('/api/v1/payment-session', { ...productPayload, language: 'es' });
    const { result } = response.data as SuccessResponseContainer<PaymentSession>;
    return result;
  } catch (error) {
    throw new Error(`Something went wrong about GET api/v1/payment-session call. Error: ${JSON.stringify(error)}`);
  }
};

export const getCustomerPortalURL = async (): Promise<CustomerPortalSession> => {
  try {
    const response = await getApiClient().post('/api/v1/customer-portal-session');
    const { result } = response.data as SuccessResponseContainer<CustomerPortalSession>;
    return result;
  } catch (error) {
    throw new Error(`Something went wrong about GET api/v1/payment-session call. Error: ${JSON.stringify(error)}`);
  }
};
