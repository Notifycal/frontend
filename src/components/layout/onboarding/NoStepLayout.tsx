import { ContentCard } from '@components/ui/ContentCard/ContentCard';
import { Outlet, useMatches } from '@tanstack/react-router';

const NoStepLayout: React.FC = () => {
  const matches = useMatches();
  const currentRoute = matches[matches.length - 1];
  const routeStaticData = currentRoute?.staticData;

  const {
    container: { narrow = false } = {}
  } = routeStaticData?.layout || {};

  return (
    <main className="mx-auto px-4 py-6 w-full">
      <ContentCard maxWidth={narrow ? 'md' : 'lg'}>
        <Outlet />
      </ContentCard>
    </main>
  );
};

export default NoStepLayout;
