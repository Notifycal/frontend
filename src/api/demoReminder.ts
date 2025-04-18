import type { DemoReminderPayload } from '@notifycal/shared/types';
import getApiClient from './common';

export const sendDemoReminder = async (data: DemoReminderPayload): Promise<void> => {
  try {
    const response = await getApiClient().post('/api/v1/demo-reminder', data);
    if (response.status === 202) {
      return;
    } else {
      throw new Error('The request failed');
    }
  } catch (error) {
    throw new Error(`Something went wrong about POST api/v1/demo-reminder call. Error: ${JSON.stringify(error)}`);
  }
};
