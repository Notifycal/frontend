import type { senderSchema } from '@notifycal/shared/schemas';
import type { z } from 'zod';
import getApiClient from './common';

export interface DemoReminderPayload {
  receiverDetails: z.infer<typeof senderSchema>;
  startTime: {
    dateTime: string;
    timeZone: string;
  };
}

export const sendDemoReminder = async (data: DemoReminderPayload): Promise<void> => {
  try {
    const response = await getApiClient().post('/api/v1/reminder', data);
    if (response.status === 202) {
      return;
    } else {
      throw new Error('The request failed');
    }
  } catch (error) {
    throw new Error(`Something went wrong about POST api/v1/reminder call. Error: ${JSON.stringify(error)}`);
  }
};
