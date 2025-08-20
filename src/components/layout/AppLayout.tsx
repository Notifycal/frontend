import { Outlet } from '@tanstack/react-router';
import type { FC } from 'react';

import Footer from '@components/ui/Footer/Footer';
import { useAuth } from '@providers/AuthProvider';

const AppLayout: FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow bg-neutral-50 flex flex-col">
        <Outlet />
      </div>
      <Footer showFeedbackLink={isAuthenticated} />
    </div>
  );
};

export default AppLayout;
