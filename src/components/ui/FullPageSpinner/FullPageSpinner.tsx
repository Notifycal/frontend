import { Loader } from '@mantine/core';

import type { JSX } from 'react';

const FullPageSpinner = (): JSX.Element => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
      <Loader color="white" data-testid="full-page-spinner" size="xl" />
    </div>
  );
};

export default FullPageSpinner;
