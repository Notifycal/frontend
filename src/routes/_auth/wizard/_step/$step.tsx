import type { KebabCase } from '@common/types';
import {
  type StepKey,
  findStepIndexByPath,
  getFirstIncompleteStepIndex,
  getStepByIndex,
  getStepByPath,
  isValidStepPath
} from '@constants/onboardingSteps';
import { useOnboardingStore } from '@store/useOnboardingStore';
import { createFileRoute, redirect, useMatch } from '@tanstack/react-router';

const StepComponent: React.FC = () => {
  const { params } = useMatch({ from: '/_auth/wizard/_step/$step' });

  const stepPathParameter = params.step as KebabCase<StepKey>;
  const CurrentStepComponent = getStepByPath(stepPathParameter)?.component;

  if (!CurrentStepComponent) {
    return <>404</>; //TODO: 404 handling
  }

  return <CurrentStepComponent />;
};

export const Route = createFileRoute('/_auth/wizard/_step/$step')({
  component: StepComponent,
  beforeLoad: ({ params }) => {
    const { completedSteps, setCurrentStep } = useOnboardingStore.getState();

    const stepPathParameter = params.step as KebabCase<StepKey>;

    const currentStepIndex = findStepIndexByPath(stepPathParameter) || 0;
    const firstIncompleteIndex = getFirstIncompleteStepIndex(completedSteps) || 0;
    
    // if (!hasIncompleteSteps(completedSteps)) {
    //   throw redirect({ to: `/wizard/completed` });
    // }
  
    const isAheadOfFirstIncomplete = currentStepIndex > firstIncompleteIndex;
    const firstIncompleteStepPath = getStepByIndex(firstIncompleteIndex)?.path || '';

    if (isAheadOfFirstIncomplete || !isValidStepPath(stepPathParameter)) {
      throw redirect({ to: `/wizard/$step`, params: { step: firstIncompleteStepPath } });
    } else {
      setCurrentStep(currentStepIndex);
    }
  }
});
