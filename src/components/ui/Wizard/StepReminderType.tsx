import { languageData } from '@common/i18n';
import type { FunctionComponent } from '@common/types';
import { Card, Group, Radio, Stack, Text } from '@mantine/core';
import { languageCodeSchema } from '@notifycal/shared/schemas';
import {
  templateEnMap,
  templateEsMap,
  type LanguageCode,
  type TemplateId,
  type TemplateMap
} from '@notifycal/shared/types';
import { DateTime } from 'luxon';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import InternationalizationPicker from '../InternationalizationPicker/InternationalizationPicker';
import type { StepBusinessDetailsValues } from './StepBusinessDetails';
import type { Step } from './Wizard';

const StepReminderTypeSchema = z.object({
  id: z.string().min(1, { message: 'onboarding.stepReminderType.noTemplateSelected' }).brand('TemplateId'),
  language: languageCodeSchema
});
export type StepReminderTypeValues = z.infer<typeof StepReminderTypeSchema>;
const StepReminderTypeComponent = (): FunctionComponent => {
  const { t, i18n } = useTranslation();
  const initialTemplateLanguage: TemplateMap = i18n.language.includes('en') ? templateEnMap : templateEsMap;
  const [templateOptions, setTemplateLanguages] = useState(initialTemplateLanguage);
  const {
    formState: { errors },
    setValue,
    watch
  } = useFormContext<StepReminderTypeValues & Pick<StepBusinessDetailsValues, 'business'>>();

  const selectedTemplateId = watch('id');
  const selectedTemplateLanguage = watch('language');
  const business = watch('business');

  const [language, setSelectedLanguage] = useState<LanguageCode>(selectedTemplateLanguage);

  useEffect(() => {
    setTemplateLanguages(language.includes('en') ? templateEnMap : templateEsMap);
  }, [language]);
  const errorKey = errors.id?.message;
  return (
    <Stack>
      <Text size="sm">{t('onboarding.stepReminderType.msg1')}</Text>
      <InternationalizationPicker
        data={languageData}
        value={language}
        onSelected={(item) => {
          setSelectedLanguage(item.code);
        }}
      />
      <Radio.Group
        error={errorKey ? t(errorKey as 'onboarding.stepReminderType.noTemplateSelected') : ''}
        value={selectedTemplateId}
        styles={{
          error: {
            paddingTop: '6px',
            paddingBottom: '6px'
          }
        }}
        onChange={(value) => {
          setValue('id', value as TemplateId);
          setValue('language', language);
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
    id: '' as TemplateId,
    language: 'es'
  }
};
