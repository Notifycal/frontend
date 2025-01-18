import { getUserCalendarsFromGoogle } from '@api/googleUserCalendar';
import type { FunctionComponent } from '@common/types';
import type { OnboardingConfig } from '@components/ui/Onboarding/Onboarding';
import { Onboarding } from '@components/ui/Onboarding/Onboarding';
import { MultiSelect, TextInput } from '@mantine/core';
import { IconRefresh } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'motion/react';
import { z } from 'zod';



export const OnboardingPage = (): FunctionComponent => {
  const variants = {
    enter: { opacity: 0, x: 50 }, // Start slightly to the right and invisible
    center: { opacity: 1, x: 0 }, // Centered and fully visible
    exit: { opacity: 0, x: -50 } // Exit to the left and invisible
  };

  const onboardingConfig: OnboardingConfig = [
    {
      component: ({ register, errors }): FunctionComponent => (
        <motion.div animate="center" className="w-full" exit="exit" initial="enter" variants={variants}>
          <p className="text-sm md:text-base text-gray-600 mb-6">
            Antes de continuar, necesitamos conocer un poco más sobre ti y tu negocio.
          </p>
          <p className="text-sm md:text-base text-gray-600 mb-6">
            Estos datos son necesarios para poder mandarle recordatorios a tus clientes.
          </p>
        </motion.div>
      ),
      // No schema, nor fields in this step
      schema: z.object({}),
      fields: []
    },
    {
      component: ({ register, errors }): FunctionComponent => {
        return (
        <motion.div animate="center" className="w-full" exit="exit" initial="enter" variants={variants}>
          <TextInput
            autoFocus
            label="Como se llama tu negocio?"
            {...register('businessName')}
            error={errors.businessName?.message}
          />
        </motion.div>
      )},
      schema: z.object({
        businessName: z.string().min(1, { message: 'El nombre del negocio es obligatorio. ' })
      }),
      fields: [
        {
          name: 'businessName',
          defaultValue: ''
        }
      ]
    },
    {
      component: ({ register, errors, watch }): FunctionComponent => {
        const businessName = watch('businessName');
        return (
          <motion.div animate="center" className="w-full" exit="exit" initial="enter" variants={variants}>
            <TextInput
              autoFocus
              label={`Cual es la direccion de ${businessName}?`}
              {...register('businessAddress')}
              error={errors['businessAddress']?.message}
            />
          </motion.div>
        );
      },
      schema: z.object({
        businessAddress: z.string().min(1, { message: 'La direccion del negocio es obligatorio. ' })
      }),
      fields: [{ name: 'businessAddress', defaultValue: '' }]
    },
    {
      component: ({ register, errors, watch }): FunctionComponent => {
        const businessName = watch('businessName');

        const { data: calendars, isLoading } = useQuery({
          queryKey: ['userIdPCalendars'],
          queryFn: getUserCalendarsFromGoogle
        });

        console.log(calendars);

        return (
          <motion.div animate="center" className="w-full" exit="exit" initial="enter" variants={variants}>
            <MultiSelect
              comboboxProps={{ shadow: 'md' }}
              data={calendars?.calendars}
              disabled={isLoading}
              label={`Selecciona los calendarios que quieres usar para ${businessName}`}
              leftSection={isLoading && <IconRefresh size={14} />}
              placeholder={isLoading ? 'Buscando calendarios del usuario...' : 'Selecciona uno o más calendarios'}
            />
          </motion.div>
        );
      },
      schema: z.object({}),
      fields: []
    },
    {
      component: (): FunctionComponent => {
        return (
          <>
            <p className="text-sm md:text-base text-gray-600 mb-6">
              Ya puedes continuar! Haz click en Finalizar para acceder a Notifycal.
            </p>
          </>
        );
      },
      // No schema, nor fields in this step
      schema: z.object({}),
      fields: []
    }
  ];

  return <Onboarding onboardingConfig={onboardingConfig} />;
};
