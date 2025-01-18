import type { ReactNode } from 'react';

import type { FunctionComponent } from '@common/types';

export default function PreFullPage({ children }: { children: ReactNode }): FunctionComponent {
  return (
    // TODO: review
    // <div className="flex h-screen flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-100"></div>
    <div className="flex h-screen flex-1 flex-col justify-center bg-gray-100">{children}</div>
  );
}
