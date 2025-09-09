import { ContentCard } from '@components/ui/ContentCard/ContentCard';
import { Faq as FaqComponent } from '@components/ui/Faq/Faq';
import type { JSX } from 'react';

export const Faq = (): JSX.Element | null => {
  return (
    <ContentCard>
      <FaqComponent showTitle={false} />
    </ContentCard>
  );
};
