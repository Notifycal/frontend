import { Feedback as FeedbackComponent } from '@components/ui/Feedback/Feedback';
import { ContentCard } from '@components/ui/ContentCard/ContentCard';
import type { JSX } from 'react';

export const Feedback = (): JSX.Element | null => {
  return (
    <ContentCard>
      <FeedbackComponent />
    </ContentCard>
  );
};
