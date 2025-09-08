import type { KebabCase } from '@common/types';
import OnboardingErrorFallback from '@components/onboarding/OnboardingErrorFallback';
import { useOnboardingNavigationStatic } from '@hooks/useOnboardingNavigation';
import type { StepKey } from '@our-types/onboarding';
import { createFileRoute, Navigate, redirect, useMatch, useNavigate } from '@tanstack/react-router';
import { ErrorBoundary } from 'react-error-boundary';

const StepComponent: React.FC = () => {
  const { params } = useMatch({ from: '/_auth/onboarding/_step/$step' });
  const navigate = useNavigate();

  const stepPathParameter = params.step as KebabCase<StepKey>;
  const CurrentStepComponent = useOnboardingNavigationStatic.getStepComponent(stepPathParameter);

  if (!CurrentStepComponent) {
    return <Navigate to="/onboarding/welcome" />;
  }

  return (
    <ErrorBoundary FallbackComponent={OnboardingErrorFallback} onReset={() => navigate({ to: '/onboarding/welcome' })}>
      <CurrentStepComponent />
    </ErrorBoundary>
  );
};

export const Route = createFileRoute('/_auth/onboarding/_step/$step')({
  component: StepComponent,
  beforeLoad: ({ params }) => {
    const stepPathParameter = params.step as KebabCase<StepKey>;
    if (!useOnboardingNavigationStatic.canStepBeAccessed(stepPathParameter)) {
      const firstIncompleteStepPath = useOnboardingNavigationStatic.getFirstIncompleteStepPath();
      throw redirect({ to: `/onboarding/$step`, params: { step: firstIncompleteStepPath } });
    }
    useOnboardingNavigationStatic.setCurrentStepFromPath(stepPathParameter);
  }
});
