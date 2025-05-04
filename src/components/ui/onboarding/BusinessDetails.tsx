import type { NotifycalI18nNamespaces } from '@common/i18n';
import { smsCharacterRegex } from '@constants/regexes';
import { zodResolver } from '@hookform/resolvers/zod';
import type { TFunction } from 'i18next';
import { z } from 'zod';

import { useStepSubmit } from '@hooks/useOnboardingStepSubmit';
import { useOnboardingStore } from '@store/useOnboardingStore';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import OnboardingNavigation from '@components/layout/onboarding/OnboardingNavigation';
import { Select, TextInput } from '@mantine/core';

const INDUSTRIES = [
  'technology',
  'healthcare',
  'finance',
  'education',
  'manufacturing',
  'retail',
  'government',
  'nonProfit',
  'other'
] as const;

type Industry = (typeof INDUSTRIES)[number];

const COMPANY_SIZES = ['me', 'xs', 'sm', 'md', 'lg', 'xl', 'xxl'] as const;

type CompanySize = (typeof COMPANY_SIZES)[number];

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const businessDetailsSchema = (t: TFunction<NotifycalI18nNamespaces, undefined>) => z.object({
  name: z
    .string()
    .min(1, { message: t('businessDetails.formNameField.isRequired') })
    .regex(smsCharacterRegex, {
      message: t('businessDetails.invalidSMSCharacters')
    })
    .brand('BusinessName'),

  address: z
    .string()
    .min(1, { message: t('businessDetails.formAddressField.isRequired') })
    .regex(smsCharacterRegex, {
      message: t('businessDetails.invalidSMSCharacters')
    })
    .brand('BusinessAddress'),
  companyIndustry: z.enum(INDUSTRIES, {
    errorMap: () => ({ message: t('businessDetails.formIndustryField.isRequired') })
  }),
  companySize: z.enum(COMPANY_SIZES, {
    errorMap: () => ({ message: t('businessDetails.formCompanySizeField.isRequired')  })
  })
});
export type BusinessDetailsValues = z.infer<ReturnType<typeof businessDetailsSchema>>;

const BusinessDetails: React.FC = () => {
  const { data } = useOnboardingStore();
  const { handleStepSubmit } = useStepSubmit();
  const { i18n, t } = useTranslation('onboarding');

  const {
    register,
    control,
    handleSubmit,
    trigger,
    formState: { errors, isValid }
  } = useForm<BusinessDetailsValues>({
    resolver: zodResolver(businessDetailsSchema(t)),
    mode: 'onChange',
    defaultValues: {
      name: data.businessDetails?.name || '',
      address: data.businessDetails?.address || '',
      companyIndustry: data.businessDetails?.companyIndustry || ('' as Industry),
      companySize: data.businessDetails?.companySize || ('' as CompanySize)
    }
  });

  // i18n.on('languageChanged', () => {
  //   console.log('two');
  //   console.log(formState.errors);
  //   if (Object.keys(formState.errors).length > 0) {
  //     void trigger();
  //   }
  // });

  const industriesData = INDUSTRIES.map((industry) => ({
    value: industry,
    label: t(`businessDetails.industries.${industry}`)
  }));

  const companySizeData = COMPANY_SIZES.map((companySize) => ({
    value: companySize,
    label: t(`businessDetails.companySizes.${companySize}`)
  }));

  return (
    <form onSubmit={handleSubmit(handleStepSubmit)}>
      <div className="space-y-6">
        {/* Company Name */}
        <TextInput
          label={t('businessDetails.formNameField.label')}
          {...register('name')}
          error={errors.name && errors.name.message}
          placeholder={t('businessDetails.formNameField.placeholder')}
          type="text"
        />
        {/* Company Address */}
        <TextInput
          label={t('businessDetails.formAddressField.label')}
          {...register('address')}
          error={errors.address && errors.address.message}
          placeholder={t('businessDetails.formAddressField.placeholder')}
          type="text"
        />

        {/* Industry */}
        <Controller
          control={control}
          name="companyIndustry"
          render={({ field }) => (
            <Select
              data={industriesData}
              label={t('businessDetails.formIndustryField.label')}
              placeholder={t('businessDetails.formIndustryField.placeholder')}
              {...field}
              error={errors.companyIndustry && errors.companyIndustry.message}
            />
          )}
        />

        {/* Team size */}
        <Controller
          control={control}
          name="companySize"
          render={({ field }) => (
            <Select
              data={companySizeData}
              label={t('businessDetails.formCompanySizeField.label')}
              placeholder={t('businessDetails.formCompanySizeField.placeholder')}
              {...field}
              error={errors.companySize && errors.companySize.message}
            />
          )}
        />

        <div className="text-sm text-gray-500 mt-4">{t('businessDetails.explanation')}</div>
      </div>

      <OnboardingNavigation canProceed={isValid} isLastStep={false} onProceed={handleSubmit(handleStepSubmit)} />
    </form>
  );
};

export default BusinessDetails;
