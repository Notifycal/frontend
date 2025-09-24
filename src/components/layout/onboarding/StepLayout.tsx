import { ContentCard } from '@components/ui/ContentCard/ContentCard';
import { useOnboardingNavigation } from '@hooks/useOnboardingNavigation';
import { Outlet } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

import { Progress, Stepper } from '@mantine/core';
import { AnimatePresence, motion } from 'motion/react';

interface SubHeaderProps {
  title: string;
  subtitle: string;
}

const SubHeader: React.FC<SubHeaderProps> = ({ title, subtitle }) => (
  <div className="text-center xl:mt-8">
    <h2 className="mt-4 mb-4 text-3xl font-semibold text-gray-800">{title}</h2>
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
  const { currentStepIndex, shouldAllowSelectStep, navigateToStep, onboardingSteps, currentStep } =
    useOnboardingNavigation();

  const { t } = useTranslation('onboarding');

  return (
    <>
      {currentStep && (
        <>
          {/* Stepper */}
          <div className="hidden xl:flex w-full justify-center bg-white">
            <div className="container mx-auto px-4 mb-6">
              <div className="w-full max-w-7xl mx-auto">
                <Stepper active={currentStepIndex} className="pt-4" size="sm" onStepClick={navigateToStep}>
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

          <div className="flex xl:hidden w-full justify-center bg-white pb-8">
            <div className="container mx-auto px-4">
              <SubHeader subtitle={t(`${currentStep.stepKey}.subtitle`)} title={t(`${currentStep.stepKey}.title`)} />
            </div>
          </div>

          <Progress radius={0} size="sm" value={(currentStepIndex / (onboardingSteps.length - 1)) * 100} />

          {/* Main content */}
          <main className="mx-auto px-4 py-4 w-full">
            <AnimatePresence mode="wait">
              <ContentCard customMaxWidth={currentStep.customWidth ?? 'max-w-3xl'} maxWidth="custom">
                <motion.div
                  key={currentStep.path}
                  animate="animate"
                  exit="exit"
                  initial="initial"
                  style={{ position: 'relative' }}
                  variants={pageTransition}
                >
                  <Outlet />
                </motion.div>
              </ContentCard>
            </AnimatePresence>
          </main>
        </>
      )}
    </>
  );
};

export default StepLayout;
