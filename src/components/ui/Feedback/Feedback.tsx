import FeedbackForm from '@components/ui/Feedback/FeedbackForm';
import { useAuth } from '@providers/AuthProvider';
import { useNavigate } from '@tanstack/react-router';
import { useEffect, type JSX } from 'react';

export const Feedback = (): JSX.Element | null => {
  const { authInfo } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authInfo?.email || !authInfo?.userId) {
      void navigate({ to: '/dashboard' });
    }
  }, [authInfo, navigate]);

  return authInfo?.email && authInfo?.userId ? <FeedbackForm email={authInfo.email} userId={authInfo.userId} /> : null;
};
