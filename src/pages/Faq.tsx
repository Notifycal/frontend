import { Faq as FaqComponent } from '@components/ui/Faq/Faq';
import type { JSX } from 'react';

export const Faq = (): JSX.Element | null => {
  return (
    <div className="mx-auto bg-white rounded-lg shadow-md p-6 md:p-8">
      <FaqComponent />
    </div>
  );
};
