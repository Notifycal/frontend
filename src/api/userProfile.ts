import getApiClient from './common';
import type { Calendar } from './googleUserCalendar';

interface UserProfile {
  UserId: string;
  UserStatus: 'onboarding' | 'live' | 'banned';
}

export const getUserProfile = async (): Promise<UserProfile> => {
  try {
    const response = await getApiClient().get('/api/v1/user-profile');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const user = response.data?.['result'] as UserProfile;
    return user;
  } catch (error) {
    throw new Error(`Something went wrong about GET api/v1/user-profile call. Error: ${JSON.stringify(error)}`);
  }
};

export interface UserProfileBusinessDetails {
  businessAddress: string;
  businessName: string;
  calendars: Array<Calendar>;
}

export const updateUserProfile = async (data: UserProfileBusinessDetails): Promise<void> => {
  try {
    const response = await getApiClient().patch('/api/v1/user-profile', { ...data, userStatus: 'live' });
    if (response.status === 204) {
      return;
    } else {
      throw new Error('The request failed');
    }
  } catch (error) {
    throw new Error(`Something went wrong about PATCH api/v1/user-profile call. Error: ${JSON.stringify(error)}`);
  }
};
