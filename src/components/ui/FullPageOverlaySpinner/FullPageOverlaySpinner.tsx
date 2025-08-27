import { Loader, Overlay } from '@mantine/core';
import type { JSX } from 'react';

const FullPageOverlaySpinner = (): JSX.Element => (
  <Overlay blur={3}>
    <div className="flex h-full w-full items-center justify-center">
      <Loader data-testid="full-page-spinner" size="xl" />
    </div>
  </Overlay>
);

export default FullPageOverlaySpinner;
