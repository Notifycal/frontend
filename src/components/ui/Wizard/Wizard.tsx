import { useState, type ComponentType } from 'react';

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

const Wizard = ({ header, wizardSteps, handleFinish, handleNext, handlePrevious }: WizardProps): FunctionComponent => {
  const [currentStep, setCurrentStep] = useState(0);

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
    console.log(isValid);
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

  const CurrentStepComponent = wizardSteps[currentStep]?.component;

  return (
    <FormProvider {...methods}>
      <form
        className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left mt-6 md:mt-0 px-6 py-12"
        onSubmit={methods.handleSubmit(async () => {
          // This isn't how react-hook-form is meant to work, hey... it works
          await handleFinish(methods.getValues());
        })}
      >
        {header && <h1 className="text-xl md:text-2xl font-bold mb-4">{header}</h1>}
        <AnimatePresence mode="wait">
          {CurrentStepComponent && (
            <motion.div
              key={currentStep}
              animate="center"
              className="w-full"
              exit="exit"
              initial="enter"
              transition={{ duration: 0.15, ease: 'easeInOut' }}
              variants={wizardTransitionVariants}
            >
              <CurrentStepComponent />
            </motion.div>
          )}
        </AnimatePresence>
        <div className="flex justify-between w-full mt-auto">
          {currentStep != 0 && (
            <Button
              className="rounded-lg"
              leftSection={<IconArrowLeft size={14} />}
              variant="light"
              onClick={onPreviousStep}
            >
              Atrás
            </Button>
          )}
          {isLastStep ? (
            <Button className="rounded-lg" rightSection={<IconCheck size={14} />} type="submit">
              Finalizar
            </Button>
          ) : (
            <Button
              className="rounded-lg"
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
