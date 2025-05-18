import { languageData, type NotifycalTFunction } from '@common/i18n';
import { flatObjectToDropdownData, labeledObjectToDropdownData } from '@common/ui';
import { createSmsContentSchema } from '@notifycal/shared/schemas';
import type { BusinessAddress, BusinessName, LanguageCode } from '@notifycal/shared/types';
import { nullableInputSchema, stringArrayValidatorSchema } from '@schemas/util';
import { z } from 'zod';

import { useFormFieldCommonProps } from '@hooks/useFormFieldCommonProps';
import { useI18nForm } from '@hooks/useI18nForm';
import { useStepSubmit } from '@hooks/useOnboardingStepSubmit';
import { useOnboardingStore } from '@store/useOnboardingStore';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import OnboardingNavigation from '@components/layout/onboarding/OnboardingNavigation';
import { CheckIcon, Group, Image, Select, TextInput } from '@mantine/core';
import { get } from 'radash';

export type Industries = {
  [key: string]: {
    label: string;
    sectors: {
      [sectorKey: string]: string;
    };
  };
};

type CompanySizes = {
  [key: string]: string;
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const businessDetailsSchema = (t: NotifycalTFunction) => {
  const industriesObject = t('businessDetails.industries', { returnObjects: true }) as Industries;
  const companySizesObject = t('businessDetails.companySizes', { returnObjects: true }) as CompanySizes;

  return z.object({
    name: createSmsContentSchema({
      invalidType: t('businessDetails.formNameField.isRequired'),
      regex: t('businessDetails.invalidSMSCharacters')
    })
      .min(1, { message: t('businessDetails.formNameField.isRequired') })
      .max(128, { message: t('businessDetails.formNameField.isMax') })
      .transform((value) => value as BusinessName),

    address: createSmsContentSchema({
      invalidType: t('businessDetails.formAddressField.isRequired'),
      regex: t('businessDetails.invalidSMSCharacters')
    })
      .min(1, { message: t('businessDetails.formAddressField.isRequired') })
      .max(128, { message: t('businessDetails.formAddressField.isMax') })
      .transform((value) => value as BusinessAddress),

    companyIndustry: z
      .object({
        category: nullableInputSchema(
          stringArrayValidatorSchema(
            Object.keys(industriesObject),
            t('businessDetails.formIndustryCategoryField.isRequired')
          ),
          t('businessDetails.formIndustryCategoryField.isRequired')
        ),
        subcategory: nullableInputSchema(
          z.string({ message: t('businessDetails.formIndustrySubcategoryField.isRequired') })
        ),
        customIndustry: z
          .string({ message: t('businessDetails.formCustomIndustryField.isRequired') })
          .max(128, { message: t('businessDetails.formCustomIndustryField.isMax') })
          .optional()
      })
      .superRefine((values, context) => {
        const isOther = [values.category, values.subcategory].includes('other');
        const isValidSubcategory = !!industriesObject[values.category]?.sectors[values.subcategory] || false;

        if (!isValidSubcategory) {
          context.addIssue({
            path: ['subcategory'],
            code: z.ZodIssueCode.custom,
            message: t('businessDetails.formIndustrySubcategoryField.isRequired')
          });
        }

        if (isOther && !values.customIndustry) {
          context.addIssue({
            path: ['customIndustry'],
            code: z.ZodIssueCode.custom,
            message: t('businessDetails.formCustomIndustryField.isRequired')
          });
        }
      }),
    companySize: nullableInputSchema(
      stringArrayValidatorSchema(Object.keys(companySizesObject), t('businessDetails.formCompanySizeField.isRequired')),
      t('businessDetails.formCompanySizeField.isRequired')
    ),
    userLanguage: nullableInputSchema(
      stringArrayValidatorSchema(Object.keys(languageData), t('businessDetails.formUserLanguageField.isRequired')),
      t('businessDetails.formUserLanguageField.isRequired')
    )
  });
};

type BusinessDetailsInput = z.input<ReturnType<typeof businessDetailsSchema>>;
type BusinessDetailsOutput = z.output<ReturnType<typeof businessDetailsSchema>>;

export type BusinessDetailsValues = BusinessDetailsOutput;

const emptyInitialValue = {
  name: '',
  address: '',
  companyIndustry: {
    category: null,
    subcategory: null,
    customIndustry: ''
  },
  companySize: null,
  userLanguage: ''
} as BusinessDetailsInput;

const BusinessDetails: React.FC = () => {
  const { data } = useOnboardingStore();
  const { handleStepSubmit } = useStepSubmit();
  const { t, i18n } = useTranslation('onboarding');

  const methods = useI18nForm<BusinessDetailsInput, unknown, BusinessDetailsOutput>(
    businessDetailsSchema,
    {
      mode: 'onChange',
      defaultValues: data.businessDetails || emptyInitialValue
    },
    t
  );

  const {
    register,
    control,
    handleSubmit,
    watch,
    resetField,
    formState: { isValid }
  } = methods;

  const { commonFormFieldProps } = useFormFieldCommonProps(methods);

  const selectedIndustryCategory = watch('companyIndustry.category');
  const selectedIndustrySubCategory = watch('companyIndustry.subcategory');
  const isCustomIndustry = [selectedIndustrySubCategory, selectedIndustryCategory].includes('other');

  const industryCatgeoryObject = t('businessDetails.industries', { returnObjects: true });
  const industryCategoryData = labeledObjectToDropdownData(industryCatgeoryObject);

  const industrySubCategoryObject = get(industryCatgeoryObject, `${selectedIndustryCategory}.sectors`, {});
  const industrySubCategoryData = flatObjectToDropdownData(industrySubCategoryObject);

  const companySizeObject = t('businessDetails.companySizes', { returnObjects: true });
  const companySizeData = flatObjectToDropdownData(companySizeObject);

  return (
    <form onSubmit={handleSubmit(handleStepSubmit)}>
      <div className="space-y-6">
        {/* Language */}
        <Controller
          control={control}
          name="userLanguage"
          render={({ field }) => {
            const image = languageData[field.value as LanguageCode]?.image;
            return (
              <Select
                clearable
                data={Object.values(languageData).map((item) => ({
                  value: item.code,
                  label: item.label
                }))}
                {...commonFormFieldProps('userLanguage', {
                  label: t('businessDetails.formUserLanguageField.label'),
                  placeholder: t('businessDetails.formUserLanguageField.placeholder'),
                  registration: field
                })}
                leftSection={image && <Image alt="" className="w-4 h-4" src={image} />}
                renderOption={({ option, checked }) => (
                  <Group flex="1" gap="xs">
                    {checked && (
                      // simulating how mantine does it for consistency, cannot reference their classnames though
                      <CheckIcon
                        style={{
                          width: '0.8em',
                          minWidth: '0.8em',
                          height: '0.8em',
                          opacity: 0.4
                        }}
                      />
                    )}
                    <Image alt="" className="w-4 h-4" src={languageData[option.value as LanguageCode].image} />
                    {option.label}
                  </Group>
                )}
                onChange={async (value) => {
                  if (value) {
                    await i18n.changeLanguage(value);
                  }
                  field.onChange(value);
                }}
              />
            );
          }}
        />

        {/* Company Name */}
        <TextInput
          type="text"
          {...commonFormFieldProps('name', {
            label: t('businessDetails.formNameField.label'),
            placeholder: t('businessDetails.formNameField.placeholder'),
            resetValue: '',
            registration: register('name')
          })}
        />

        {/* Company Address */}
        <TextInput
          type="text"
          {...commonFormFieldProps('address', {
            label: t('businessDetails.formAddressField.label'),
            placeholder: t('businessDetails.formAddressField.placeholder'),
            resetValue: '',
            registration: register('address')
          })}
        />

        {/* Industry */}
        <div className="xl:flex gap-6">
          <div className="xl:w-1/2">
            <Controller
              control={control}
              name="companyIndustry.category"
              render={({ field }) => {
                return (
                  <Select
                    clearable
                    data={industryCategoryData}
                    {...commonFormFieldProps('companyIndustry.category', {
                      label: t('businessDetails.formIndustryCategoryField.label'),
                      placeholder: t('businessDetails.formIndustryCategoryField.placeholder'),
                      registration: field
                    })}
                    onChange={(value) => {
                      resetField('companyIndustry.subcategory', { defaultValue: null });
                      // resetField('companyIndustry.subcategory', {defaultValue: ''});
                      field.onChange(value);
                    }}
                    onClear={() => {
                      resetField('companyIndustry.subcategory', { defaultValue: null });
                    }}
                  />
                );
              }}
            />
          </div>
          <div className="xl:w-1/2 mt-6 xl:mt-0">
            <Controller
              control={control}
              name="companyIndustry.subcategory"
              render={({ field }) => (
                <Select
                  clearable
                  data={industrySubCategoryData}
                  disabled={!selectedIndustryCategory}
                  {...commonFormFieldProps('companyIndustry.subcategory', {
                    label: t('businessDetails.formIndustrySubcategoryField.label'),
                    placeholder: t('businessDetails.formIndustrySubcategoryField.placeholder'),
                    registration: field
                  })}
                />
              )}
            />
          </div>
        </div>
        {isCustomIndustry && (
          <TextInput
            {...commonFormFieldProps('companyIndustry.customIndustry', {
              label: t('businessDetails.formCustomIndustryField.label'),
              placeholder: t('businessDetails.formCustomIndustryField.placeholder'),
              resetValue: '',
              registration: register('companyIndustry.customIndustry')
            })}
            type="text"
          />
        )}
        {/* Company size */}
        <Controller
          control={control}
          name="companySize"
          render={({ field }) => {
            // console.log(field.value);
            return (
              <Select
                clearable
                data={companySizeData}
                {...commonFormFieldProps('companySize', {
                  label: t('businessDetails.formCompanySizeField.label'),
                  placeholder: t('businessDetails.formCompanySizeField.placeholder'),
                  registration: field
                })}
              />
            );
          }}
        />

        <div className="text-sm text-gray-500 mt-4">{t('businessDetails.explanation')}</div>
      </div>

      <OnboardingNavigation canProceed={isValid} onProceed={handleSubmit(handleStepSubmit)} />
    </form>
  );
};

export default BusinessDetails;
