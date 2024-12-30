import apiClient from './common';

interface UserProfile {
  UserId: string; // TODO: make this user-id
}

export const getUserProfile = async (): Promise<UserProfile> => {
  try {
    const response = await apiClient.get('/api/v1/user-profile');
    console.log('data:', response);
    return response.data as UserProfile;
  } catch (error) {
    throw new Error(`Something went wrong about api/v1/user-profile call. Error: ${JSON.stringify(error)}`);
  }
};
