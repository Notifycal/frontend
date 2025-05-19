import type { FunctionComponent } from '@common/types';
import FeedbackForm from '@components/ui/Feedback/Feedback';
import type { Email, UserId } from '@notifycal/shared/types';

export const Feedback = (): FunctionComponent => {
  const userEmail = 'sergio.test5@gmail.com' as Email;
  const userId = '12345' as UserId;
  return (
    <div>
      <FeedbackForm email={userEmail} userId={userId} />
    </div>
  );
};
