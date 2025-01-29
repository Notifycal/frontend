import getApiClient from './common';

export interface Calendar {
  id: string;
  name: string;
}

export const getUserCalendarsFromGoogle = async (): Promise<Array<Calendar>> => {
  try {
    const response = await getApiClient().get('/api/v1/idp/user-calendars');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const calendars = response.data?.['result'] as Array<Calendar>;
    return calendars;
  } catch (error) {
    throw new Error(`Something went wrong about GET /api/v1/idp/user-calendars call. Error: ${JSON.stringify(error)}`);
  }
};
