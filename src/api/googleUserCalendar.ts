import type { Calendar, SuccessResponseContainer } from '@notifycal/shared/types';
import getApiClient from './common';

export const getUserCalendarsFromGoogle = async (): Promise<Array<Calendar>> => {
  try {
    const response = await getApiClient().get('/api/v1/idp/user-calendars');
    const { result } = response.data as SuccessResponseContainer<Array<Calendar>>;
    return result;
  } catch (error) {
    throw new Error(`Something went wrong about GET /api/v1/idp/user-calendars call. Error: ${JSON.stringify(error)}`);
  }
};
