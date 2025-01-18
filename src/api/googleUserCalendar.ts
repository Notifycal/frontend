import { sleep } from '@common/utils';
import getApiClient from './common';

const fakeResponse = {
  calendars: ['foobar@gmail.com', 'foobar2@gmail.com', 'foobar3@gmail.com']
};

interface UserCalendars {
  calendars: Array<string>; // TODO: review
}

export const getUserCalendarsFromGoogle = async (): Promise<UserCalendars> => {
  console.log('Fake API');
  await sleep(5000);
  return fakeResponse as UserCalendars;

  try {
    const response = await getApiClient().get('/api/v1/user-calendars');
    console.log('data:', response);
    return {
      ...response.data
    } as UserCalendars;
  } catch (error) {
    throw new Error(`Something went wrong about api/v1/user-calendars call. Error: ${JSON.stringify(error)}`);
  }
};
