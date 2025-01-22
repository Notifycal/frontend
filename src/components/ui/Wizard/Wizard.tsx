import { useState, type ComponentType, type HTMLProps } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';

import { Button } from '@mantine/core';
import { IconArrowLeft, IconArrowRight, IconCheck } from '@tabler/icons-react';
import { AnimatePresence, motion } from 'motion/react';

import type { FunctionComponent } from '@common/types';
import { z, type ZodSchema } from 'zod';

// Utility to infer form values from wizardConfig
export type InferFormValues<T> = T extends Array<{ defaultValues: infer U }> ? U : never;

// Generic type for form values
export type FormValues = Record<string, unknown>; // Replace with a specific structure if needed

export type Step<TFormValues extends Record<string, unknown>> = {
  component: ComponentType;
  schema: ZodSchema<TFormValues>;
  defaultValues: TFormValues;
};

export type WizardConfig<TFormValues extends Record<string, unknown>> = Array<Step<TFormValues>>;

interface WizardProps {
  header: string;
  className?: HTMLProps<HTMLElement>['className'];
  buttonClassName?: HTMLProps<HTMLElement>['className'];
  wizardSteps: WizardConfig<FormValues>;
  handleFinish: (data: FormValues) => Promise<unknown>;
  handleNext?: () => void;
  handlePrevious?: () => void;
}

export const wizardTransitionVariants = {
  enter: { opacity: 0, x: 50 }, // Start slightly to the right and invisible
  center: { opacity: 1, x: 0 }, // Centered and fully visible
  exit: { opacity: 0, x: -50 } // Exit to the left and invisible
};

const Wizard = ({
  header,
  wizardSteps,
  className,
  buttonClassName = 'rounded-lg',
  handleFinish,
  handleNext,
  handlePrevious
}: WizardProps): FunctionComponent => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isWaitingForFinish, setWaitingForFinish] = useState(false);

  const isLastStep = currentStep === wizardSteps.length - 1;

  const defaultValues = wizardSteps.reduce(
    (accumulator, step) => ({
      ...accumulator,
      ...step.defaultValues
    }),
    {}
  );

  const { schema } = wizardSteps[currentStep] || { schema: z.object({}) };

  const methods = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: 'onTouched',
    shouldUnregister: false
  });

  const onNextStep = async (): Promise<void> => {
    const isValid = await methods.trigger();
    if (isValid) {
      if (handleNext) {
        handleNext();
      }
      setCurrentStep((previous) => previous + 1);
    }
  };

  const onPreviousStep = (): void => {
    if (handlePrevious) {
      handlePrevious();
    }
    setCurrentStep((previous) => previous - 1);
  };

  const onFormFinish = async (): Promise<void> => {
    setWaitingForFinish(true);
    const formData = methods.getValues();
    await handleFinish(formData);
    setWaitingForFinish(false);
  };

  const CurrentStepComponent = wizardSteps[currentStep]?.component;

  return (
    <FormProvider {...methods}>
      <form
        className={`flex flex-col ${className}`}
        // className={`w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left ${className}`}
        onSubmit={onFormFinish}
      >
        {header && <h1 className="text-xl md:text-2xl font-bold mb-4">{header}</h1>}
        <AnimatePresence mode="wait">
          {CurrentStepComponent && (
            <motion.div
              key={currentStep}
              animate="center"
              className="flex-1"
              exit="exit"
              initial="enter"
              transition={{ duration: 0.15, ease: 'easeInOut' }}
              variants={wizardTransitionVariants}
            >
              <CurrentStepComponent />
            </motion.div>
          )}
        </AnimatePresence>
        <div className="flex justify-between">
          {currentStep != 0 && (
            <Button
              className={buttonClassName}
              leftSection={<IconArrowLeft size={14} />}
              variant="light"
              onClick={onPreviousStep}
            >
              Atrás
            </Button>
          )}
          {isLastStep ? (
            <Button
              key={currentStep}
              className={buttonClassName}
              loading={isWaitingForFinish}
              rightSection={<IconCheck size={14} />}
              type="submit"
            >
              Finalizar
            </Button>
          ) : (
            <Button
              key={currentStep}
              className={buttonClassName}
              rightSection={<IconArrowRight size={14} />}
              type="button"
              onClick={onNextStep}
            >
              Continuar
            </Button>
          )}
        </div>
      </form>
    </FormProvider>
  );
};

export default Wizard;
