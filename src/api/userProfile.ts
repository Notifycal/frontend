import getApiClient from './common';

interface UserProfile {
  UserId: string; // TODO: make this user-id
  UserStatus: 'live' | 'banned' | 'onboarding';
}

export const getUserProfile = async (): Promise<UserProfile> => {
  try {
    const response = await getApiClient().get('/api/v1/user-profile');
    console.log('data:', response);
    return {
      ...response.data,
      Status: 'onboarding'
    } as UserProfile;
  } catch (error) {
    throw new Error(`Something went wrong about api/v1/user-profile call. Error: ${JSON.stringify(error)}`);
  }
};
