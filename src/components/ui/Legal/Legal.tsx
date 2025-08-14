import { Typography } from '@mantine/core';
import type { JSX } from 'react';

import Footer from '@components/ui/Footer/Footer';

interface LegalProps {
  htmlText: string;
}

export const Legal = ({ htmlText }: LegalProps): JSX.Element => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="flex-1 max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <Typography>
            <div dangerouslySetInnerHTML={{ __html: htmlText }} />
          </Typography>
        </div>
      </main>

      <Footer />
    </div>
  );
};
