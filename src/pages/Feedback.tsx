import type { FunctionComponent } from '@common/types';
import FeedbackForm from '@components/ui/Feedback/Feedback';
import { useAuth } from '@providers/AuthProvider';
import { useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';

export const Feedback = (): FunctionComponent => {
  const { authInfo } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authInfo?.email || !authInfo?.userId) {
      void navigate({ to: '/dashboard' });
    }
  }, [authInfo, navigate]);

  return authInfo?.email && authInfo?.userId ? (
    <div>
      <FeedbackForm email={authInfo.email} userId={authInfo.userId} />
    </div>
  ) : null;
};
