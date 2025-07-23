import type { TierId, TopupId, Url, SuccessResponseContainer, CustomerPortalFlowType } from '@notifycal/shared/types';
import getApiClient from './common';

export type RedirectUrlSession = { url: Url };

export type PaymentSession = RedirectUrlSession;
export type CustomerPortalSession = RedirectUrlSession;

type CheckoutPayload = { tier: TierId } | { topup: TopupId };

export const getProductCheckoutURL = async (productPayload: CheckoutPayload): Promise<PaymentSession> => {
  try {
    const response = await getApiClient().post('/api/v1/payment-session', { ...productPayload, language: 'es' });
    const { result } = response.data as SuccessResponseContainer<PaymentSession>;
    return result;
  } catch (error) {
    throw new Error(`Something went wrong about POST api/v1/payment-session call. Error: ${JSON.stringify(error)}`);
  }
};

export const getCustomerPortalURL = async (flowType?: CustomerPortalFlowType): Promise<CustomerPortalSession> => {
  const payload = flowType ? { flowType } : {};
  try {
    const response = await getApiClient().post('/api/v1/customer-portal-session', payload);
    const { result } = response.data as SuccessResponseContainer<CustomerPortalSession>;
    return result;
  } catch (error) {
    throw new Error(`Something went wrong about POST api/v1/customer-portal-session call. Error: ${JSON.stringify(error)}`);
  }
};
