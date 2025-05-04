import { Outlet } from '@tanstack/react-router';

const NoStepLayout: React.FC = () => {
  return (
    <main className="flex-1 container mx-auto px-4 py-6">
      <div className="w-full max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6 md:p-8">
        <Outlet />
      </div>
    </main>
  );
};

export default NoStepLayout;
