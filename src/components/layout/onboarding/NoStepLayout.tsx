import { Outlet, useMatches } from '@tanstack/react-router';
import clsx from 'clsx';

const NoStepLayout: React.FC = () => {
  const matches = useMatches();
  const currentRoute = matches[matches.length - 1];
  const routeStaticData = currentRoute?.staticData;

  const { narrowContainer = false } = routeStaticData?.layout || {};

  return (
    <main className="mx-auto px-4 py-6 w-full">
      <div
        className={clsx(
          'w-full mx-auto bg-white rounded-lg shadow-md p-6 md:p-8',
          narrowContainer ? 'max-w-3xl' : 'max-w-5xl'
        )}
      >
        <Outlet />
      </div>
    </main>
  );
};

export default NoStepLayout;
