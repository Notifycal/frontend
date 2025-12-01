import { DateTime } from 'luxon';
import { z } from 'zod';

import { languageData, type NotifycalTFunction } from '@common/i18n';
import { languageCodeSchema } from '@notifycal/shared/schemas';
import {
  templateCaMap,
  templateEnMap,
  templateEsMap,
  type LanguageCode,
  type Template,
  type TemplateId
} from '@notifycal/shared/types';

import { useI18nForm } from '@hooks/useI18nForm';
import { useOnboardingNavigation } from '@hooks/useOnboardingNavigation';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import OnboardingNavigation from '@components/layout/onboarding/OnboardingNavigation';
import { Alert, HoverCard } from '@mantine/core';
import InternationalizationPicker from '../ui/InternationalizationPicker/InternationalizationPicker';
import {
  ReminderTypeCardRadioGroup,
  ReminderTypeCardRadioGroupOption
} from '../ui/ReminderTypeCardRadioGroup/ReminderTypeCardRadioGroup';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const reminderTypeSchema = (t: NotifycalTFunction) =>
  z.object({
    reminderId: z
      .string()
      .min(1, { message: t('reminderType.formReminderTypeField.isRequired') })
      .transform((value) => value as TemplateId),
    reminderLanguage: languageCodeSchema
  });

type ReminderTypeInput = z.input<ReturnType<typeof reminderTypeSchema>>;
type ReminderTypeOutput = z.output<ReturnType<typeof reminderTypeSchema>>;
export type ReminderTypeValues = ReminderTypeOutput;

const emptyInitialValue = (languageCode: LanguageCode): ReminderTypeInput => ({
  reminderId: '' as TemplateId,
  reminderLanguage: languageCode
});

const ReminderType: React.FC = () => {
  const { onboardingData, handleStepSubmit, requireDataFromSteps } = useOnboardingNavigation();
  const { businessDetails } = requireDataFromSteps(['businessDetails']);

  const { t, i18n } = useTranslation('onboarding');

  const {
    control,
    watch,
    handleSubmit,
    setValue,
    formState: { isValid, errors }
  } = useI18nForm<ReminderTypeInput, unknown, ReminderTypeOutput>(
    reminderTypeSchema,
    {
      mode: 'onChange',
      defaultValues: onboardingData.reminderType || emptyInitialValue(i18n.languages[0] as LanguageCode)
    },
    t
  );

  const selectedReminderLanguage = watch('reminderLanguage');
  const selectedReminderTemplateId = watch('reminderId');

  const map: Record<LanguageCode, Record<string, Template>> = {
    en: templateEnMap,
    es: templateEsMap,
    ca: templateCaMap
  };
  const initialTemplateLanguage = map[selectedReminderLanguage];

  const interpolatedTemplates = Object.fromEntries(
    Object.entries(initialTemplateLanguage).map(([key, { id, language, interpolate }]) => [
      key,
      {
        id,
        language,
        text: interpolate(businessDetails.name, businessDetails.address, DateTime.now())
      }
    ])
  );

  const selectedTemplate = interpolatedTemplates[selectedReminderTemplateId];

  return (
    <form onSubmit={handleSubmit(handleStepSubmit)}>
      <div className="space-y-6">
        <div className="flex justify-end items-center space-x-2">
          <span className="text-sm text-gray-500">{t('reminderType.changeReminderLanguage')}</span>
          <Controller
            control={control}
            name="reminderLanguage"
            render={({ field: { value, onChange } }) => (
              <InternationalizationPicker
                displayFlagOnly
                data={languageData}
                value={value || (i18n.languages[0] as LanguageCode)}
                onSelected={(item) => {
                  setValue('reminderId', '' as TemplateId);
                  onChange(item.code);
                }}
              />
            )}
          />
        </div>

        <Controller
          control={control}
          name="reminderId"
          render={({ field: { value, onChange } }) => (
            <ReminderTypeCardRadioGroup value={value || ''} onChange={onChange}>
              {Object.values(interpolatedTemplates).map((template) => (
                <ReminderTypeCardRadioGroupOption key={template.id} text={template.text} value={template.id} />
              ))}
            </ReminderTypeCardRadioGroup>
          )}
        />
        {errors && <div className="text-sm text-rose-500">{errors.reminderId?.message}</div>}
        <Alert color="blue" variant="light">
          <div className="text-sm text-gray-500">
            {t('reminderType.characterCountHeadsUpBilling.msg1')}{' '}
            <HoverCard shadow="md" width={280}>
              <HoverCard.Target>
                <span className="text-primary-600 underline cursor-help">
                  {t('reminderType.characterCountHeadsUpBilling.msg2')}
                </span>
              </HoverCard.Target>
              <HoverCard.Dropdown>
                <span className="text-sm">{t('reminderType.specialCharactersExplanation')}</span>
              </HoverCard.Dropdown>
            </HoverCard>
          </div>
          {!!selectedReminderTemplateId && selectedTemplate && (
            <div className="text-sm text-gray-500 mt-4">
              {t('reminderType.characterCount', {
                characterCount: selectedTemplate.text.length
              })}
            </div>
          )}
        </Alert>
      </div>

      <OnboardingNavigation canProceed={isValid} onProceed={handleSubmit(handleStepSubmit)} />
    </form>
  );
};

export default ReminderType;
