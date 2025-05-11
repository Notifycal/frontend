import type { NotifycalTFunction } from '@common/i18n';
import { z } from 'zod';
import { smsValidStringSchema, stringArrayValidatorSchema } from '@schemas/util';
import { flatObjectToDropdownData, labeledObjectToDropdownData } from '@common/ui';

import { useStepSubmit } from '@hooks/useOnboardingStepSubmit';
import { useOnboardingStore } from '@store/useOnboardingStore';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useFormFieldCommonProps } from '@hooks/useFormFieldCommonProps';
import { useI18nForm } from '@hooks/useI18nForm';

import { Select, TextInput } from '@mantine/core';
import OnboardingNavigation from '@components/layout/onboarding/OnboardingNavigation';

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
    name: smsValidStringSchema({
      messageRegex: t('businessDetails.invalidSMSCharacters')
    })
      .min(1, { message: t('businessDetails.formNameField.isRequired') })
      .brand('BusinessName'),

    address: smsValidStringSchema({
      messageRegex: t('businessDetails.invalidSMSCharacters')
    })
      .min(1, { message: t('businessDetails.formAddressField.isRequired') })
      .brand('BusinessAddress'),

    companyIndustry: z
      .object({
        category: stringArrayValidatorSchema(
          Object.keys(industriesObject),
          t('businessDetails.formIndustryCategoryField.isRequired')
        ),
        subcategory: z.string({ message: t('businessDetails.formIndustrySubcategoryField.isRequired') }),
        customIndustry: z.string({ message: t('businessDetails.formCustomIndustryField.isRequired') }).optional()
      })
      .superRefine((data, context) => {
        console.log(data);
        const isOther = [data.category, data.subcategory].includes('other');
        const isValidSubcategory = !!industriesObject[data.category]?.sectors[data.subcategory] || false;

        if (!isValidSubcategory) {
          context.addIssue({
            path: ['subcategory'],
            code: z.ZodIssueCode.custom,
            message: t('businessDetails.formIndustrySubcategoryField.isRequired')
          });
        }

        if (isOther && !data.customIndustry) {
          context.addIssue({
            path: ['customIndustry'],
            code: z.ZodIssueCode.custom,
            message: t('businessDetails.formCustomIndustryField.isRequired')
          });
        }
      }),
    companySize: stringArrayValidatorSchema(
      Object.keys(companySizesObject),
      t('businessDetails.formCompanySizeField.isRequired')
    )
  });
};

export type BusinessDetailsValues = z.infer<ReturnType<typeof businessDetailsSchema>>;

const emptyInitialValue = {
  name: '',
  address: '',
  companyIndustry: {
    category: undefined,
    subcategory: undefined,
    customIndustry: ''
  },
  companySize: undefined
} as const;

const BusinessDetails: React.FC = () => {
  const { data } = useOnboardingStore();
  const { handleStepSubmit } = useStepSubmit();
  const { t } = useTranslation('onboarding');

  const methods = useI18nForm<BusinessDetailsValues>(
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

        {/* Industry2 */}
        <div className="xl:flex gap-6">
          <div className="xl:w-1/2">
            <Controller
              control={control}
              name="companyIndustry.category"
              render={({ field }) => {
                return (
                  <Select
                    data={industryCategoryData}
                    {...commonFormFieldProps('companyIndustry.category', {
                      label: t('businessDetails.formIndustryCategoryField.label'),
                      placeholder: t('businessDetails.formIndustryCategoryField.placeholder'),
                      resetValue: null,
                      registration: field,
                      afterFieldClear: () => {
                        resetField('companyIndustry.subcategory');
                      }
                    })}
                    onChange={(value) => {
                      resetField('companyIndustry.subcategory');
                      field.onChange(value);
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
                  data={industrySubCategoryData}
                  disabled={!selectedIndustryCategory}
                  {...commonFormFieldProps('companyIndustry.subcategory', {
                    label: t('businessDetails.formIndustrySubcategoryField.label'),
                    placeholder: t('businessDetails.formIndustrySubcategoryField.placeholder'),
                    resetValue: null,
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
        {/* Team size */}
        <Controller
          control={control}
          name="companySize"
          render={({ field }) => {
            // console.log(field.value);
            return (
              <Select
                data={companySizeData}
                {...commonFormFieldProps('companySize', {
                  label: t('businessDetails.formCompanySizeField.label'),
                  placeholder: t('businessDetails.formCompanySizeField.placeholder'),
                  resetValue: null,
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
