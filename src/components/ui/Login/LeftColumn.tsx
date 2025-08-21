import type { JSX, ReactNode } from 'react';

interface LeftColumnProps {
  readonly children: ReactNode;
}

export const LeftColumn = ({ children }: LeftColumnProps): JSX.Element => {
  return (
    <div className="flex flex-col justify-center bg-white flex-1 basis-0">
      <div className="mx-auto max-w-sm lg:w-96 px-4">{children}</div>
    </div>
  );
};
