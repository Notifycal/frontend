import { Faq as FaqComponent } from '@components/ui/Faq/Faq';
import { ContentCard } from '@components/ui/ContentCard/ContentCard';
import type { JSX } from 'react';

export const Faq = (): JSX.Element | null => {
  return (
    <ContentCard>
      <FaqComponent />
    </ContentCard>
  );
};
