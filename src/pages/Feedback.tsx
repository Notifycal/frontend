import { Feedback as FeedbackComponent } from '@components/ui/Feedback/Feedback';
import type { JSX } from 'react';

export const Feedback = (): JSX.Element | null => {
  return (
    <div className="mx-auto bg-white rounded-lg shadow-md p-6 md:p-8">
      <FeedbackComponent></FeedbackComponent>
    </div>
  );
};
