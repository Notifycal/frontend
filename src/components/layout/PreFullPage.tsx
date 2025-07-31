import type { JSX, ReactNode } from 'react';

export default function PreFullPage({ children }: { children: ReactNode }): JSX.Element {
  return <div className="flex h-screen flex-1 flex-col justify-center bg-gray-100">{children}</div>;
}
