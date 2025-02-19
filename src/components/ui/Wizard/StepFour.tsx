import type { FunctionComponent } from '@common/types';
import { Card, Radio, Stack, Text } from '@mantine/core';
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

const StepFourSchema = z.object({
  templateId: z
    .string()
    .min(1, { message: i18next.t('onboarding.step4.noTemplateSelected') })
    .brand('TemplateId')
});
export type StepFourValues = z.infer<typeof StepFourSchema>;
const StepFourComponent = (): FunctionComponent => {
  const { t, i18n } = useTranslation();
  const initialTemplateLanguage: TemplateMap = i18n.language === 'en' ? templateEnMap : templateEsMap;
  const [templateOptions, setTemplateLanguages] = useState(initialTemplateLanguage);
  const {
    formState: { errors },
    setValue,
    watch
  } = useFormContext<StepFourValues>();
  const selectedTemplateId = watch('templateId');

  return (
    <Stack>
      <Text size="sm">{t('onboarding.step4.msg1')}</Text>
      <LanguagePicker
        onLanguageSelected={(item) => {
          setTemplateLanguages(item.shorthand === 'es' ? templateEsMap : templateEnMap);
        }}
      />
      <Radio.Group
        error={errors.templateId?.message}
        value={selectedTemplateId}
        onChange={(value) => {
          setValue('templateId', value as TemplateId);
        }}
      >
        <Stack>
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
        </Stack>
      </Radio.Group>
    </Stack>
  );
};

export const StepFour: Step<typeof StepFourSchema> = {
  component: StepFourComponent,
  schema: StepFourSchema,
  defaultValues: {
    templateId: '' as TemplateId
  }
};
