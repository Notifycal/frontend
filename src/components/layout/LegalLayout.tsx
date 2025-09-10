import { ContentCard } from '@components/ui/ContentCard/ContentCard';
import type { FC, ReactNode } from 'react';

interface LegalLayoutProps {
  children: ReactNode;
}

const LegalLayout: FC<LegalLayoutProps> = ({ children }) => {
  return (
    <div className="mx-auto px-6 py-8">
      <ContentCard maxWidth="xl">{children}</ContentCard>
    </div>
  );
};

export default LegalLayout;
