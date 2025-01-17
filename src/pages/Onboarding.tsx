import type { FunctionComponent } from '@common/types';
import { Button, MultiSelect, TextInput } from '@mantine/core';
import { IconArrowLeft, IconArrowRight, IconCheck } from '@tabler/icons-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';

import { getUserCalendarsFromGoogle } from '@api/googleUserCalendar';
import onboardingImg from '@assets/images/onboarding.png';
import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';

const Step0 = (): FunctionComponent => (
  <>
    <h1 className="text-xl md:text-2xl font-bold mb-4">Bienvenid@ a Notifycal</h1>
    <p className="text-sm md:text-base text-gray-600 mb-6">
      Antes de continuar, necesitamos conocer un poco más sobre ti y tu negocio.
    </p>
    <p className="text-sm md:text-base text-gray-600 mb-6">
      Estos datos son necesarios para poder mandarle recordatorios a tus clientes.
    </p>
  </>
);

const Step1 = (): FunctionComponent => {
  const {
    register,
    formState: { errors }
  } = useFormContext();

  console.log(errors);

  return (
    <>
      <h1 className="text-xl md:text-2xl font-bold mb-4">Bienvenid@ a Notifycal</h1>
      <p className="text-sm md:text-base text-gray-600 mb-6"></p>
      <TextInput
        className="w-full"
        label="Como se llama tu negocio?"
        {...register('businessName')}
        error={errors.businessName?.message}
      />
    </>
  );
};

const Step2 = (): FunctionComponent => {
  const {
    register,
    watch,
    formState: { errors }
  } = useFormContext();

  const businessName = watch('businessName');

  return (
    <>
      <h1 className="text-xl md:text-2xl font-bold mb-4">Bienvenid@ a Notifycal</h1>
      <p className="text-sm md:text-base text-gray-600 mb-6"></p>
      <TextInput
        className="w-full"
        label={`Cual es la direccion de ${businessName}?`}
        {...register('businessAddress')}
        error={errors.businessAddress?.message}
      />
    </>
  );
};

const StepCalendar = (): FunctionComponent => {
  const {
    register,
    watch,
    formState: { errors }
  } = useFormContext();

  const businessName = watch('businessName');

  const { data: calendars, isLoading } = useQuery({
    queryKey: ['userIdPCalendars'],
    queryFn: getUserCalendarsFromGoogle
  });

  console.log(calendars);

  return (
    <>
      <h1 className="text-xl md:text-2xl font-bold mb-4">Bienvenid@ a Notifycal</h1>
      <p className="text-sm md:text-base text-gray-600 mb-6">{isLoading && 'Buscando calendarios del usuario...'}</p>

      <MultiSelect
        className="w-full"
        data={calendars?.calendars}
        label={`Selecciona los calendarios que quieres usar para ${businessName}`}
      />
    </>
  );
};

const StepFinish = (): FunctionComponent => {
  const {
    register,
    formState: { errors }
  } = useFormContext();

  console.log(errors);

  return (
    <>
      <h1 className="text-xl md:text-2xl font-bold mb-4">Bienvenid@ a Notifycal</h1>
      <p className="text-sm md:text-base text-gray-600 mb-6"></p>
      <TextInput
        className="w-full"
        label="Cual es la direccion de tu negocio?"
        {...register('businessAddress')}
        error={errors.businessAddress?.message}
      />
    </>
  );
};

export const Onboarding = (): FunctionComponent => {
  const { t } = useTranslation();

  const [currentStep, setCurrentStep] = useState(0);

  const stepSchemas = [
    z.object({}),
    z.object({
      businessName: z.string().min(1, { message: 'El nombre del negocio es obligatorio. ' })
    }),
    z.object({
      businessAddress: z.string().min(1, { message: 'La direccion del negocio es obligatorio. ' })
    }),
    z.object({})
  ];

  const defaultValues = {
    businessName: '',
    businessAddress: ''
  };

  const steps = [<Step0 />, <Step1 />, <Step2 />, <StepCalendar />, <StepFinish />];

  const isLastStep = currentStep === steps.length - 1;

  const methods = useForm({
    resolver: zodResolver(stepSchemas[currentStep]),
    defaultValues,
    mode: 'onTouched'
  });

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
            <form className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left mt-6 md:mt-0 px-6 py-12">
              {steps[currentStep]}
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
