import { getFirstIncompleteStepIndex, getStepByIndex, onboardingSteps } from '@constants/onboardingSteps';

import { useOnboardingStore } from '@store/useOnboardingStore';
import { Outlet, useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

import { Progress, Stepper } from '@mantine/core';
import { AnimatePresence, motion } from 'motion/react';
import clsx from 'clsx';

interface SubHeaderProps {
  title: string;
  subtitle: string;
}

const SubHeader: React.FC<SubHeaderProps> = ({ title, subtitle }) => (
  <div className="text-center 2xl:mt-8">
    <h2 className="mt-4 mb-4 text-xl font-semibold text-gray-800">{title}</h2>
    <p className="mt-4 mb-4 text-gray-600">{subtitle}</p>
  </div>
);

const pageTransition = {
  initial: { opacity: 0, x: 50 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -50 },
  transition: { duration: 0.5 }
};

const StepLayout: React.FC = () => {
  const { currentStep, completedSteps } = useOnboardingStore();
  const navigate = useNavigate();

  const { t } = useTranslation('onboarding');

  const firstIncompleteIndex = getFirstIncompleteStepIndex(completedSteps) || 0;
  const shouldAllowSelectStep = (step: number): boolean => firstIncompleteIndex >= step;

  const step = getStepByIndex(currentStep);

  return (
    <>
      {step && (
        <>
          {/* Stepper */}
          <div className="hidden 2xl:flex w-full justify-center bg-white">
            <div className="container mx-auto px-4 mb-6">
              <div className="w-full max-w-7xl mx-auto">
                <Stepper
                  active={currentStep}
                  size="sm"
                  onStepClick={async (stepIndex) => {
                    const step = getStepByIndex(stepIndex);
                    if (step) {
                      await navigate({ to: `/onboarding/$step`, params: { step: step.path } });
                    }
                  }}
                >
                  {onboardingSteps.map(({ path, stepKey }, index) => {
                    const tTitle = t(`${stepKey}.title`);
                    return (
                      <Stepper.Step key={path} allowStepSelect={shouldAllowSelectStep(index)} label={tTitle}>
                        <SubHeader subtitle={t(`${stepKey}.subtitle`)} title={tTitle} />
                      </Stepper.Step>
                    );
                  })}
                </Stepper>
              </div>
            </div>
          </div>

          {/* SubHeader for mobile (was inside Stepper block before) */}

          <div className="flex 2xl:hidden w-full justify-center bg-white pb-8">
            <div className="container mx-auto px-4 mt-4">
              <SubHeader subtitle={t(`${step.stepKey}.subtitle`)} title={t(`${step.stepKey}.title`)} />
            </div>
          </div>

          <Progress radius={0} size="sm" value={(currentStep / (onboardingSteps.length - 1)) * 100} />

          {/* Main content */}
          <main className="flex-1 container mx-auto px-4 py-6">
            <AnimatePresence mode="wait">
              <div
                className={clsx(
                  'w-full mx-auto bg-white rounded-lg shadow-md p-6 md:p-8',
                  step.customWidth ?? 'max-w-3xl'
                )}
              >
                <motion.div
                  key={step.path}
                  animate="animate"
                  exit="exit"
                  initial="initial"
                  style={{ position: 'relative' }}
                  variants={pageTransition}
                >
                  <Outlet />
                </motion.div>
              </div>
            </AnimatePresence>
          </main>
        </>
      )}
    </>
  );
};

export default StepLayout;
