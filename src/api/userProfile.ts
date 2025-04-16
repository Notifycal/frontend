import type { ReminderConfig } from '@notifycal/shared/schemas';
import type { IdpName, SuccessResponseContainer, User } from '@notifycal/shared/types';
import getApiClient from './common';

export const getUserProfile = async (): Promise<User<IdpName>> => {
  try {
    const response = await getApiClient().get('/api/v1/user-profile');
    const { result } = response.data as SuccessResponseContainer<User<IdpName>>;
    return result;
  } catch (error) {
    throw new Error(`Something went wrong about GET api/v1/user-profile call. Error: ${JSON.stringify(error)}`);
  }
};

export const updateUserProfile = async (data: ReminderConfig): Promise<void> => {
  try {
    const response = await getApiClient().patch('/api/v1/user-profile', data);
    if (response.status === 204) {
      return;
    } else {
      throw new Error('The request failed');
    }
  } catch (error) {
    throw new Error(`Something went wrong about PATCH api/v1/user-profile call. Error: ${JSON.stringify(error)}`);
  }
};