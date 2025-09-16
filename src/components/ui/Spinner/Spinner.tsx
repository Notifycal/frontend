import type { JSX } from 'react';

export type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface SpinnerProps {
  size?: SpinnerSize;
  className?: string;
  'data-testid'?: string;
}

const sizeMap: Record<SpinnerSize, string> = {
  xs: 'w-4 h-4',
  sm: 'w-5 h-5',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-12 h-12'
};

const Spinner = ({ size = 'md', className = '', 'data-testid': dataTestId }: SpinnerProps): JSX.Element => (
  <div
    className={`inline-block rounded-full animate-spin ${sizeMap[size]} ${className}`}
    data-testid={dataTestId}
    style={{
      border: '5px solid transparent',
      borderTop: '5px solid rgb(34, 197, 94)',
      borderRight: '5px solid rgb(34, 197, 94)',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    }}
  />
);

export default Spinner;
