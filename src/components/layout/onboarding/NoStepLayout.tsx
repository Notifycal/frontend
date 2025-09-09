import { Outlet, useMatches } from '@tanstack/react-router';
import { ContentCard } from '@components/ui/ContentCard/ContentCard';

const NoStepLayout: React.FC = () => {
  const matches = useMatches();
  const currentRoute = matches[matches.length - 1];
  const routeStaticData = currentRoute?.staticData;

  const { narrowContainer = false } = routeStaticData?.layout || {};

  return (
    <main className="mx-auto px-4 py-6 w-full">
      <ContentCard maxWidth={narrowContainer ? 'md' : 'lg'}>
        <Outlet />
      </ContentCard>
    </main>
  );
};

export default NoStepLayout;
