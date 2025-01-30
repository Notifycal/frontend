import { Loader } from '@mantine/core';

import type { FunctionComponent } from '@common/types';

const FullPageSpinner = (): FunctionComponent => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
      <Loader color="white" size="xl" />
    </div>
  );
};

export default FullPageSpinner;
