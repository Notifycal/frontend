import { Typography } from '@mantine/core';
import type { JSX } from 'react';

interface LegalProps {
  htmlText: string;
}

export const Legal = ({ htmlText }: LegalProps): JSX.Element => {
  return (
    <Typography>
      <div dangerouslySetInnerHTML={{ __html: htmlText }} />
    </Typography>
  );
};
