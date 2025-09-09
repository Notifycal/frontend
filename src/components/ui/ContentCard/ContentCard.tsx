import clsx from 'clsx';
import type { JSX, ReactNode } from 'react';

type MaxWidth = 'sm' | 'md' | 'lg' | 'xl' | 'full' | 'custom';

interface ContentCardProps {
  children: ReactNode;
  maxWidth?: MaxWidth;
  customMaxWidth?: string;
}

const maxWidthClasses: Record<MaxWidth, string> = {
  sm: 'max-w-sm',
  md: 'max-w-3xl',
  lg: 'max-w-5xl',
  xl: 'max-w-7xl',
  full: 'max-w-full',
  custom: ''
};

export const ContentCard = ({ children, maxWidth = 'md', customMaxWidth }: ContentCardProps): JSX.Element => {
  const maxWidthClass = maxWidth === 'custom' ? customMaxWidth : maxWidthClasses[maxWidth];

  return (
    <div className={clsx('w-full mx-auto bg-white rounded-lg shadow-md p-6 md:p-8', maxWidthClass)}>{children}</div>
  );
};
