import { zodResolver } from '@hookform/resolvers/zod';
import { DateTime } from 'luxon';
import { z } from 'zod';

import { languageData, type NotifycalI18nNamespaces } from '@common/i18n';
import { languageCodeSchema } from '@notifycal/shared/schemas';
import {
  templateEnMap,
  templateEsMap,
  type BusinessAddress,
  type BusinessName,
  type TemplateId,
  type TemplateMap
} from '@notifycal/shared/types';
import type { TFunction } from 'i18next';

import { useStepSubmit } from '@hooks/useOnboardingStepSubmit';
import { useOnboardingStore } from '@store/useOnboardingStore';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import OnboardingNavigation from '@components/layout/onboarding/OnboardingNavigation';
import InternationalizationPicker from '../ui/InternationalizationPicker/InternationalizationPicker';
import {
  ReminderTypeCardRadioGroup,
  ReminderTypeCardRadioGroupOption
} from '../ui/ReminderTypeCardRadioGroup/ReminderTypeCardRadioGroup';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const reminderTypeSchema = (t: TFunction<NotifycalI18nNamespaces, undefined>) =>
  z.object({
    reminderId: z
      .string()
      .min(1, { message: t('reminderType.formReminderTypeField.isRequired') })
      .brand('TemplateId'),
    reminderLanguage: languageCodeSchema
  });

export type ReminderTypeValues = z.infer<ReturnType<typeof reminderTypeSchema>>;

const ReminderType: React.FC = () => {
  const { data } = useOnboardingStore();
  const { handleStepSubmit } = useStepSubmit();

  const { t, i18n } = useTranslation('onboarding');

  const {
    control,
    watch,
    handleSubmit,
    setValue,
    reset,
    formState: { isValid, errors }
  } = useForm<ReminderTypeValues>({
    resolver: zodResolver(reminderTypeSchema(t)),
    mode: 'onChange',
    defaultValues: {
      reminderId: data.reminderType?.reminderId || '',
      reminderLanguage: data.reminderType?.reminderLanguage || (i18n.languages[0] as keyof typeof languageData)
    }
  });

  useEffect(() => {
    void i18n.language;
    reset(undefined, {keepValues: true });
  }, [i18n.language, reset]);

  // using watch only because we want to use this value before it's saved
  const selectedReminderLanguage = watch('reminderLanguage');
  // const selectedReminderTemplateId = watch('reminderId');
  const initialTemplateLanguage: TemplateMap = selectedReminderLanguage.startsWith('en')
    ? templateEnMap
    : templateEsMap;

  // const selectedTemplate = initialTemplateLanguage[selectedReminderTemplateId];

  // const interpolatedTemplates = {};

  // for (const [key, template] of Object.entries(initialTemplateLanguage)) {
  //   interpolatedTemplates[key] = {
  //     id: template.id,
  //     language: template.language,
  //     template: template.interpolate(
  //       data.businessDetails?.name as BusinessName,
  //       data.businessDetails?.address as BusinessAddress,
  //       DateTime.now()
  //     )
  //   };
  // }

  // const languageTemplates = Object.values(initialTemplateLanguage).map((template) => {
  //   return {
  //     value: template.id,
  //     description: template.interpolate(
  //       data.businessDetails?.name as BusinessName,
  //       data.businessDetails?.address as BusinessAddress,
  //       DateTime.now()
  //     )
  //   };
  // });

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
                value={value}
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
            <ReminderTypeCardRadioGroup value={value} onChange={onChange}>
              {Object.values(initialTemplateLanguage).map((template) => (
                <ReminderTypeCardRadioGroupOption
                  key={template.id}
                  value={template.id}
                  text={template.interpolate(
                    data.businessDetails?.name as BusinessName,
                    data.businessDetails?.address as BusinessAddress,
                    DateTime.now()
                  )}
                />
              ))}
            </ReminderTypeCardRadioGroup>
          )}
        />
        {errors && <div className="text-sm text-rose-500">{errors.reminderId?.message}</div>}

        <div className="text-sm text-gray-500 mt-4">{t('reminderType.characterCountHeadsUpBilling')}</div>
        {/* {!!selectedReminderTemplateId && selectedTemplate && (
          <div className="text-sm text-gray-500 mt-4">
            {t('reminderType.characterCount', {
              characterCount: selectedTemplate.length
            })}
          </div>
        )} */}
      </div>

      <OnboardingNavigation canProceed={isValid} isLastStep={false} onProceed={handleSubmit(handleStepSubmit)} />
    </form>
  );
};

export default ReminderType;
