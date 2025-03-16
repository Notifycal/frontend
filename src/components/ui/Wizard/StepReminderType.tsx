import { type LanguageCode, languageData } from '@common/i18n';
import type { FunctionComponent } from '@common/types';
import { Card, Group, Radio, Stack, Text } from '@mantine/core';
import { templateEnMap, templateEsMap } from '@notifycal/shared/templates';
import type { TemplateId, TemplateMap } from '@notifycal/shared/types';
import i18next from 'i18next';
import { DateTime } from 'luxon';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import LanguagePicker from '../LanguagePicker/LanguagePicker';
import type { StepBusinessDetailsValues } from './StepBusinessDetails';
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
  } = useFormContext<StepReminderTypeValues & Pick<StepBusinessDetailsValues, 'business'>>();

  const [language, setSelectedLanguage] = useState<LanguageCode>('es');

  const selectedTemplateId = watch('templateId');
  const business = watch('business');

  useEffect(() => {
    setTemplateLanguages(language === 'es' ? templateEsMap : templateEnMap);
  }, [language]);

  return (
    <Stack>
      <Text size="sm">{t('onboarding.stepReminderType.msg1')}</Text>
      <LanguagePicker
        languageData={languageData}
        value={language}
        onLanguageSelected={(item) => {
          setSelectedLanguage(item.code);
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
                label={<Text size="xs">{template.interpolate(business.name, business.address, DateTime.now())}</Text>}
                value={template.id}
              />
            </Card>
          ))}
        </Group>
      </Radio.Group>
      <Text hidden={!selectedTemplateId} size="xs">
        {t('onboarding.stepReminderType.characterCounterHeadsUp', {
          characterCount: templateOptions[selectedTemplateId]?.interpolate(
            business.name,
            business.address,
            DateTime.now()
          ).length
        })}
      </Text>
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
