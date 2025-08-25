import { Outlet } from '@tanstack/react-router';
import type { FC } from 'react';

import Footer from '@components/ui/Footer/Footer';
import { useAuth } from '@providers/AuthProvider';
import { TwSizeIndicator } from '@components/utils/development-tools/TwSizeIndicator';

const AppLayout: FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <TwSizeIndicator />
      <div className="min-h-[100dvh] flex flex-col">
        <div className="flex-grow bg-neutral-50 flex flex-col">
          <Outlet />
        </div>
        <Footer showFeedbackLink={isAuthenticated} />
      </div>
    </>
  );
};

export default AppLayout;
