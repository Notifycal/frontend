import type { FunctionComponent } from '@common/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, Group, Notification, Paper, Select, Text, Textarea } from '@mantine/core';
import type { Email } from '@notifycal/shared/types';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

interface FeedbackFormProps {
  email: Email;
}

const feedbackSchema = z.object({
  type: z.string().min(1, { message: 'Debes seleccionar un tipo de feedback' }),
  content: z.string().min(5, { message: 'El mensaje debe tener al menos 5 caracteres' })
});

type FeedbackFormValues = z.infer<typeof feedbackSchema>;

const FeedbackForm = ({ email }: FeedbackFormProps): FunctionComponent => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<FeedbackFormValues>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      type: '',
      content: ''
    }
  });

  const onSubmit = (data: FeedbackFormValues): void => {
    setIsSubmitting(true);
    const formUrl = `https://docs.google.com/forms/d/e/1FAIpQLSe3W5tM1itSTDAuP9vQK2xxcDtAfag19fD0WIx9g0_5SDQK3w/formResponse?&submit=Submit?&usp=sharing&ouid=115891966119018277387&entry.1265482339=${encodeURIComponent(data.type)}&entry.237189155=${encodeURIComponent(data.content)}&entry.1858806569=${encodeURIComponent(email)}`;
    window.open(formUrl, '_blank');

    setIsSubmitting(false);
    setSubmitted(true);
    reset();
  };

  const handleReset = (): void => {
    setSubmitted(false);
    reset();
  };

  return (
    <Paper p="md" shadow="xs">
      {submitted ? (
        <Box>
          <Notification color="green" title="¡Gracias por tu feedback!" onClose={handleReset}>
            Hemos recibido tu información y la revisaremos pronto.
          </Notification>
          <Group mt="md">
            <Button onClick={handleReset}>Enviar otro feedback</Button>
          </Group>
        </Box>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <Text mb="md" size="lg">
            Tu opinión es importante para nosotros
          </Text>

          <Controller
            control={control}
            name="type"
            render={({ field }) => (
              <Select
                {...field}
                error={errors.type?.message}
                label="Tipo de feedback"
                mb="md"
                placeholder="Selecciona una opción"
                data={[
                  { value: 'Feature request', label: 'Solicitud de funcionalidad' },
                  { value: 'Feedback', label: 'Feedback general' },
                  { value: 'Bug', label: 'Reporte de error' },
                  { value: 'Complain', label: 'Queja' },
                  { value: 'Other', label: 'Otro' }
                ]}
                onChange={(value) => {
                  field.onChange(value || '');
                }}
              />
            )}
          />

          <Controller
            control={control}
            name="content"
            render={({ field }) => (
              <Textarea
                {...field}
                error={errors.content?.message}
                label="Mensaje"
                mb="lg"
                minRows={4}
                placeholder="Escribe tu feedback aquí..."
              />
            )}
          />

          <Group>
            <Button loading={isSubmitting} type="submit">
              Enviar
            </Button>
          </Group>
        </form>
      )}
    </Paper>
  );
};

export default FeedbackForm;
