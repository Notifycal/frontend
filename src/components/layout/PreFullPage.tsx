import type { ReactNode } from 'react';

import type { FunctionComponent } from '@common/types';

export default function PreFullPage({ children }: { children: ReactNode }): FunctionComponent {
  return <div className="flex h-screen flex-1 flex-col justify-center bg-gray-100">{children}</div>;
}
