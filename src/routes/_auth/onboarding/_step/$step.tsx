import type { KebabCase } from '@common/types';
import OnboardingErrorFallback from '@components/onboarding/OnboardingErrorFallback';
import {
  type StepKey,
  findStepIndexByProperty,
  getFirstIncompleteStepIndex,
  getStepByIndex,
  getStepByProperty,
  isValidStepPath
} from '@constants/onboardingSteps';
import { useOnboardingStore } from '@store/useOnboardingStore';
import { createFileRoute, Navigate, redirect, useMatch, useNavigate } from '@tanstack/react-router';
import { ErrorBoundary } from 'react-error-boundary';

const StepComponent: React.FC = () => {
  const { params } = useMatch({ from: '/_auth/onboarding/_step/$step' });
  const navigate = useNavigate();

  const stepPathParameter = params.step as KebabCase<StepKey>;
  const CurrentStepComponent = getStepByProperty('path', stepPathParameter)?.component;

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
    const { completedSteps, setCurrentStep } = useOnboardingStore.getState();

    const stepPathParameter = params.step as KebabCase<StepKey>;

    const currentStepIndex = findStepIndexByProperty('path', stepPathParameter) || 0;
    const firstIncompleteIndex = getFirstIncompleteStepIndex(completedSteps) || 0;

    const isAheadOfFirstIncomplete = currentStepIndex > firstIncompleteIndex;
    const firstIncompleteStepPath = getStepByIndex(firstIncompleteIndex)?.path || '';

    if (isAheadOfFirstIncomplete || !isValidStepPath(stepPathParameter)) {
      throw redirect({ to: `/onboarding/$step`, params: { step: firstIncompleteStepPath } });
    } else {
      setCurrentStep(currentStepIndex);
    }
  }
});
