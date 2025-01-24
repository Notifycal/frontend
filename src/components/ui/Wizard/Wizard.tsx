import { useState, type ComponentType, type HTMLProps } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm, type DefaultValues, type FieldValues } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@mantine/core';
import { IconArrowLeft, IconArrowRight, IconCheck } from '@tabler/icons-react';
import { AnimatePresence, motion } from 'motion/react';

import type { FunctionComponent } from '@common/types';

export type Step<TSchema extends z.AnyZodObject> = {
  component: ComponentType;
  schema: TSchema;
  defaultValues: z.infer<TSchema>;
};

export type WizardConfig<TSchema extends z.AnyZodObject> = Array<Step<TSchema>>;

interface WizardProps<TSchema extends z.AnyZodObject, TResult extends FieldValues> {
  header: string;
  className?: HTMLProps<HTMLElement>['className'];
  buttonClassName?: HTMLProps<HTMLElement>['className'];
  wizardSteps: WizardConfig<TSchema>;
  handleFinish: (data: TResult) => Promise<void>;
  handleNext?: () => void;
  handlePrevious?: () => void;
}

export const wizardTransitionVariants = {
  enter: { opacity: 0, x: 50 }, // Start slightly to the right and invisible
  center: { opacity: 1, x: 0 }, // Centered and fully visible
  exit: { opacity: 0, x: -50 } // Exit to the left and invisible
};

function Wizard<TResult extends FieldValues>({
  header,
  wizardSteps,
  className,
  buttonClassName = 'rounded-lg',
  handleFinish,
  handleNext,
  handlePrevious
}: WizardProps<z.AnyZodObject, TResult>): FunctionComponent {
  const [currentStep, setCurrentStep] = useState(0);
  const [isWaitingForFinish, setWaitingForFinish] = useState(false);

  const isLastStep = currentStep === wizardSteps.length - 1;

  const { schema } = wizardSteps[currentStep] || { schema: z.object({}) };
  const defaultValues = wizardSteps
    .map((s) => s.defaultValues)
    .reduce(
      (accumulator, item) => ({
        ...accumulator,
        ...item
      }),
      {}
    ) as DefaultValues<TResult>;
  const methods = useForm<TResult>({
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
      <form className={`flex flex-col ${className}`} onSubmit={onFormFinish}>
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
              disabled={isWaitingForFinish}
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
}

export default Wizard;
