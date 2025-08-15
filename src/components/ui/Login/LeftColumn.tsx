import type { JSX, ReactNode } from 'react';

interface LeftColumnProps {
  readonly children: ReactNode;
}

export const LeftColumn = ({ children }: LeftColumnProps): JSX.Element => {
  return (
    <div className="flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24 bg-white lg:w-1/2 lg:order-1">
      <div className="mx-auto w-full max-w-sm lg:w-96">{children}</div>
    </div>
  );
};
