import type { FC, ReactNode } from 'react';

interface LegalLayoutProps {
  children: ReactNode;
}

const LegalLayout: FC<LegalLayoutProps> = ({ children }) => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="bg-white rounded-lg shadow-sm p-8 md:p-8">{children}</div>
    </div>
  );
};

export default LegalLayout;
