import OverlaySpinner from '@components/ui/Spinner/OverlaySpinner';
import type { JSX } from 'react';

const FullPageOverlaySpinner = (): JSX.Element => <OverlaySpinner blur={3} data-testid="full-page-spinner" size="xl" />;

export default FullPageOverlaySpinner;
