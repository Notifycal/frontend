import { zodResolver } from '@hookform/resolvers/zod';
import { useFormFieldCommonProps } from '@hooks/useFormFieldCommonProps';
import { Box, Button, Group, Notification, Paper, Select, Textarea } from '@mantine/core';
import type { Email, UserId } from '@notifycal/shared/types';
import { useState, type JSX } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

// This component is used to collect feedback from users. It uses a Google Form to submit the feedback. Make sure of the following:
// - update the form ID and field IDs in the code below if you start pointing at a different Google Form. Edits don't seem to change field ids.
// - Enable "Disable autosave for all respondents" so that the form doesn't try to save the draft response in the user's Google Drive and form can be submitted on tab load.
// - Collect email addresses "Do not collect" so Google authentication is not required. User ids are passed by the app automatically.
// - Make sure to set the form to "Anyone with the link can respond" so that users can submit the form without being logged in.
// Note: implementation is based on https://stackoverflow.com/questions/71714110/can-you-submit-a-restful-request-to-a-google-forms-api

interface FeedbackFormProps {
  email: Email;
  userId: UserId;
  showTitle?: boolean;
}

const FeedbackForm = ({ email, userId, showTitle = true }: FeedbackFormProps): JSX.Element => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { t } = useTranslation();

  const feedbackSchema = z.object({
    type: z.string().min(1, { message: t('feedback.type') }),
    content: z.string().min(5, { message: t('feedback.content') })
  });

  type FeedbackFormValues = z.infer<typeof feedbackSchema>;

  const methods = useForm<FeedbackFormValues>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      type: '',
      content: ''
    }
  });
  const {
    control,
    handleSubmit,
    reset,
    register,
    formState: { errors }
  } = methods;

  const { commonFormFieldProps } = useFormFieldCommonProps(methods);

  const onSubmit = (data: FeedbackFormValues): void => {
    setIsSubmitting(true);
    const formId = `1FAIpQLSe3W5tM1itSTDAuP9vQK2xxcDtAfag19fD0WIx9g0_5SDQK3w`;
    const sharingLink = `usp=sharing&ouid=115891966119018277387`;
    const formFieldsAndResponse = {
      '1265482339': data.type,
      '237189155': data.content,
      '1858806569': email,
      '383910741': userId
    };
    const queryParameters = Object.entries(formFieldsAndResponse)
      .map(([key, value]) => `entry.${key}=${encodeURIComponent(value)}`)
      .join('&');
    const formUrl = `https://docs.google.com/forms/d/e/${formId}/formResponse?&submit=Submit?&${sharingLink}&${queryParameters}`;
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
    <Paper>
      {submitted ? (
        <Box>
          <Notification color="green" title={t('feedback.thankYou')} onClose={handleReset}>
            {t('feedback.received')}
          </Notification>
          <Group mt="md">
            <Button onClick={handleReset}>{t('feedback.sendAnother')}</Button>
            <Button component="a" href="/dashboard">
              {t('feedback.goToDashboard')}
            </Button>
          </Group>
        </Box>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          {showTitle && <h1 className="text-2xl font-bold text-secondary-500 mb-5">{t('feedback.title')}</h1>}

          <h5 className="mb-4 font-regular">{t('feedback.importance')}</h5>

          <Controller
            control={control}
            name="type"
            render={({ field }) => (
              <Select
                {...field}
                clearable
                error={errors.type?.message}
                label={t('feedback.typeLabel')}
                mb="md"
                placeholder={t('feedback.selectOption')}
                data={[
                  // Gotcha: these values need to match values in field in the Google Form. It is case-sensitive.
                  { value: 'Feature request', label: t('feedback.featureRequest') },
                  { value: 'Feedback', label: t('feedback.generalFeedback') },
                  { value: 'Bug', label: t('feedback.bugReport') },
                  { value: 'Complain', label: t('feedback.complaint') },
                  { value: 'Other', label: t('feedback.other') }
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
                {...commonFormFieldProps('content', {
                  label: t('feedback.messageLabel'),
                  placeholder: t('feedback.messagePlaceholder'),
                  resetValue: '',
                  registration: register('content')
                })}
                autosize
                error={errors.content?.message}
                mb="lg"
                minRows={8}
              />
            )}
          />

          <Group>
            <Button loading={isSubmitting} type="submit">
              {t('feedback.submit')}
            </Button>
          </Group>
        </form>
      )}
    </Paper>
  );
};

export default FeedbackForm;
