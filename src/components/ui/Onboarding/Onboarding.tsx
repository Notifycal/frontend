import type { FunctionComponent } from '@common/types';
import { Button } from '@mantine/core';
import { IconArrowLeft, IconArrowRight, IconCheck } from '@tabler/icons-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  FormProvider,
  useForm,
  type FieldErrors,
  type FieldValues,
  type UseFormRegister
} from 'react-hook-form';

import onboardingImg from '@assets/images/onboarding.png';
import { AnimatePresence } from 'motion/react';

type Field = {
  name: string;
  defaultValue: string | undefined;
};

type Step = {
  component: (props: {
    register: UseFormRegister<FieldValues>;
    errors: FieldErrors<FieldValues>;
    watch?: (field: string) => any;
  }) => FunctionComponent;
  schema: any;
  fields: Array<Field>;
};

export type OnboardingConfig = Array<Step>;

export const Onboarding = ({ onboardingConfig }: { onboardingConfig: OnboardingConfig }): FunctionComponent => {
  const { t } = useTranslation();

  const [currentStep, setCurrentStep] = useState(0);

  const isLastStep = currentStep === onboardingConfig.length - 1;

  const defaultValues = onboardingConfig.reduce<Record<string, unknown>>(
    (accumulator: Record<string, unknown>, step: Step) => {
      if (step.fields && step.fields.length > 0) {
        const stepDefaults = step.fields.reduce<Record<string, unknown>>(
          (fieldAccumulator: Record<string, unknown>, field: Field) => ({
            ...fieldAccumulator,
            [field.name]: field.defaultValue || '' // Add the field's default value
          }),
          {} as Record<string, unknown> // Explicitly type the inner reduce
        );
        return { ...accumulator, ...stepDefaults }; // Merge step defaults into accumulated defaults
      }
      return accumulator;
    },
    {} as Record<string, unknown> // Explicitly type the initial accumulator
  );

  const methods = useForm({
    resolver: zodResolver(onboardingConfig[currentStep]?.schema),
    defaultValues,
    mode: 'onTouched',
  });

  const { watch } = methods;

  const handleNext = async () => {
    const isValid = await methods.trigger();
    console.log(isValid);
    if (isValid) {
      setCurrentStep((previous) => previous + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep((previous) => previous - 1);
  };

  const handleFinish = (data) => {
    console.log('Form submitted with data:', data);
  };

  return (
    <div className="flex h-screen flex-1 flex-col justify-center bg-gray-100">
      <div className="sm:mx-auto sm:w-full sm:max-w-[1000px] bg-white shadow-md sm:rounded-lg h-1/2">
        <div className="flex flex-col md:flex-row items-stretch justify-center h-full">
          <div className="w-full md:w-1/2 flex border-r border-gray-400-600">
            <img
              alt="Puzzle illustration"
              className="w-full h-full max-w-sm md:max-w-full object-cover"
              src={onboardingImg}
            />
          </div>
          <FormProvider {...methods}>
            <form
              className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left mt-6 md:mt-0 px-6 py-12"
              onSubmit={methods.handleSubmit(handleFinish)}
              onKeyDown={async (event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  await handleNext();
                }
              }}
            >
              <h1 className="text-xl md:text-2xl font-bold mb-4">Bienvenid@ a Notifycal</h1>
              <AnimatePresence>
                {
                  onboardingConfig[currentStep]?.component({
                    register: methods.register,
                    errors: methods.formState.errors,
                    watch,
                  })
                }
                
              </AnimatePresence>
              <div className="flex justify-between w-full mt-auto">
                {currentStep != 0 && (
                  <Button
                    className="rounded-lg"
                    leftSection={<IconArrowLeft size={14} />}
                    variant="light"
                    onClick={handleBack}
                  >
                    Atrás
                  </Button>
                )}
                <Button
                  className="rounded-lg"
                  rightSection={isLastStep ? <IconCheck size={14} /> : <IconArrowRight size={14} />}
                  onClick={isLastStep ? handleFinish : handleNext}
                >
                  {isLastStep ? 'Finalizar' : 'Continuar'}
                </Button>
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </div>
  );
};
