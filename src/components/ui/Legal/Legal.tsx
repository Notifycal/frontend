import { Typography } from '@mantine/core';
import type { JSX } from 'react';

interface LegalProps {
  htmlText: string;
}

export const Legal = ({ htmlText }: LegalProps): JSX.Element => {
  return (
    <main className="max-w-4xl mx-auto px-6 py-8">
      <Typography>
        <div dangerouslySetInnerHTML={{ __html: htmlText }} />
      </Typography>
    </main>
  );
};
