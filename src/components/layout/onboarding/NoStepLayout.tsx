import { ContentCard } from '@components/ui/ContentCard/ContentCard';
import { useRouteStaticData } from '@hooks/useRouteStaticData';
import { Outlet } from '@tanstack/react-router';

const NoStepLayout: React.FC = () => {
  const { container: { narrow = false } = {} } = useRouteStaticData(['layout.container']);

  return (
    <main className="mx-auto px-4 py-6 w-full">
      <ContentCard maxWidth={narrow ? 'md' : 'lg'}>
        <Outlet />
      </ContentCard>
    </main>
  );
};

export default NoStepLayout;
