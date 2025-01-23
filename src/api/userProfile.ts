import getApiClient from './common';

interface UserProfile {
  UserId: string;
  Status: 'onboarding' | 'live' | 'banned';
}

export const getUserProfile = async (): Promise<UserProfile> => {
  try {
    const response = await getApiClient().get('/api/v1/user-profile');
    return {
      ...response.data
    } as UserProfile;
  } catch (error) {
    throw new Error(`Something went wrong about GET api/v1/user-profile call. Error: ${JSON.stringify(error)}`);
  }
};

export interface UserProfileBusinessDetails {
  businessAddress: string;
  businessName: string;
  businessCalendars: Array<string>;
}

export const updateUserProfile = async (data: UserProfileBusinessDetails): Promise<void> => {
  try {
    const response = await getApiClient().put('/api/v1/user-profile', data);
    if (response.status === 200) {
      return;
    } else {
      throw new Error('The request failed');
    }
  } catch (error) {
    throw new Error(`Something went wrong about PUT api/v1/user-profile call. Error: ${JSON.stringify(error)}`);
  }
};
