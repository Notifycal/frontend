import getApiClient from './common';

interface UserCalendars {
  Calendars: Array<string>; // TODO: review
}

export const getUserCalendarsFromGoogle = async (): Promise<UserCalendars> => {
  try {
    const response = await getApiClient().get('/api/v1/user-calendars');
    return {
      ...response.data
    } as UserCalendars;
  } catch (error) {
    throw new Error(`Something went wrong about GET /api/v1/user-calendars call. Error: ${JSON.stringify(error)}`);
  }
};
