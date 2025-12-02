import type {
  CustomerPortalFlowType,
  LanguageCode,
  SuccessResponseContainer,
  TierId,
  TopupId,
  Url
} from '@notifycal/shared/types';
import getApiClient from './common';

export type RedirectUrlSession = { url: Url };

export type PaymentSession = RedirectUrlSession;
export type CustomerPortalSession = RedirectUrlSession;

type WithLanguage<T> = T & { language: LanguageCode };

export type TopupCheckoutURLPayload = WithLanguage<{ topup: TopupId }>;
export type TierCheckoutURLPayload = WithLanguage<{ tier: TierId | 'good-trial' }>;

type CheckoutPayload = TierCheckoutURLPayload | TopupCheckoutURLPayload;

export const getProductCheckoutURL = async (productPayload: CheckoutPayload): Promise<PaymentSession> => {
  try {
    const response = await getApiClient().post('/api/v1/payment-session', productPayload);
    const { result } = response.data as SuccessResponseContainer<PaymentSession>;
    return result;
  } catch (error) {
    throw new Error(`Something went wrong about POST api/v1/payment-session call. Error: ${JSON.stringify(error)}`);
  }
};

type CustomerPortalPayload = WithLanguage<{ flowType?: CustomerPortalFlowType }>;

export const getCustomerPortalURL = async (payload: CustomerPortalPayload): Promise<CustomerPortalSession> => {
  try {
    const response = await getApiClient().post('/api/v1/customer-portal-session', payload);
    const { result } = response.data as SuccessResponseContainer<CustomerPortalSession>;
    return result;
  } catch (error) {
    throw new Error(
      `Something went wrong about POST api/v1/customer-portal-session call. Error: ${JSON.stringify(error)}`
    );
  }
};
