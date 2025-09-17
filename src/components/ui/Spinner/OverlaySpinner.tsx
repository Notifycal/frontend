import type { JSX } from 'react';
import Spinner, { type SpinnerSize } from './Spinner';

interface OverlaySpinnerProps {
  size?: SpinnerSize;
  blur?: number;
  'data-testid'?: string;
}

const OverlaySpinner = ({ size = 'xl', blur = 3, 'data-testid': dataTestId }: OverlaySpinnerProps): JSX.Element => (
  <div
    className={`fixed inset-0 z-50 flex items-center justify-center`}
    style={{
      backdropFilter: `blur(${blur}px)`,
      WebkitBackdropFilter: `blur(${blur}px)`,
      backgroundColor: 'rgba(0, 0, 0, 0.8)'
    }}
  >
    <Spinner size={size} {...(dataTestId && { 'data-testid': dataTestId })} />
  </div>
);

export default OverlaySpinner;
