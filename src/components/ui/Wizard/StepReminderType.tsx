import type { FunctionComponent } from '@common/types';
import { Card, Group, Radio, Stack, Text } from '@mantine/core';
import { templateEnMap, templateEsMap } from '@notifycal/shared/templates';
import type { BusinessAddress, BusinessName, TemplateId, TemplateMap } from '@notifycal/shared/types';
import i18next from 'i18next';
import { DateTime } from 'luxon';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import LanguagePicker from '../LanguagePicker/LanguagePicker';
import type { Step } from './Wizard';

const StepReminderTypeSchema = z.object({
  templateId: z
    .string()
    .min(1, { message: i18next.t('onboarding.stepReminderType.noTemplateSelected') })
    .brand('TemplateId')
});
export type StepReminderTypeValues = z.infer<typeof StepReminderTypeSchema>;
const StepReminderTypeComponent = (): FunctionComponent => {
  const { t, i18n } = useTranslation();
  const initialTemplateLanguage: TemplateMap = i18n.language === 'en' ? templateEnMap : templateEsMap;
  const [templateOptions, setTemplateLanguages] = useState(initialTemplateLanguage);
  const {
    formState: { errors },
    setValue,
    watch
  } = useFormContext<StepReminderTypeValues>();
  const selectedTemplateId = watch('templateId');

  return (
    <Stack>
      <Text size="sm">{t('onboarding.stepReminderType.msg1')}</Text>
      <LanguagePicker
        onLanguageSelected={(item) => {
          setTemplateLanguages(item.shorthand === 'es' ? templateEsMap : templateEnMap);
        }}
      />
      <Radio.Group
        error={errors.templateId?.message}
        value={selectedTemplateId}
        styles={{
          error: {
            paddingTop: '6px',
            paddingBottom: '6px'
          }
        }}
        onChange={(value) => {
          setValue('templateId', value as TemplateId);
        }}
      >
        <Group>
          {Object.values(templateOptions).map((template) => (
            <Card key={template.id} withBorder padding="xs">
              <Radio
                value={template.id}
                label={
                  <Text size="xs">
                    {template.interpolate(
                      'Notifycal' as BusinessName,
                      'Avenue Legendary, 54, Spain' as BusinessAddress,
                      DateTime.now()
                    )}
                  </Text>
                }
              />
            </Card>
          ))}
        </Group>
      </Radio.Group>
    </Stack>
  );
};

export const StepReminderType: Step<typeof StepReminderTypeSchema> = {
  component: StepReminderTypeComponent,
  schema: StepReminderTypeSchema,
  defaultValues: {
    templateId: '' as TemplateId
  }
};
