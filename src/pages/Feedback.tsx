import type { FunctionComponent } from '@common/types';
import FeedbackForm from '@components/ui/Feedback/Feedback';
import type { Email } from '@notifycal/shared/types';

export const Feedback = (): FunctionComponent => {
  const userEmail = 'sergio.test4@gmail.com' as Email;
  return (
    <div>
      <FeedbackForm email={userEmail} />
    </div>
  );
};
