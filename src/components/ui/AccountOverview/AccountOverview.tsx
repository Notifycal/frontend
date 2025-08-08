import type { BusinessDetailsValues } from '@components/onboarding/BusinessDetails';
import type { CalendarsValues } from '@components/onboarding/Calendars';
import type { SenderDetailsValues } from '@components/onboarding/SenderDetails';
import { phoneByCountry } from '@notifycal/shared/i18n';
import clsx from 'clsx';
import type { ParseKeys } from 'i18next';
import { useTranslation } from 'react-i18next';

type AccountOverviewProps = {
  businessDetails: BusinessDetailsValues;
  calendars: CalendarsValues;
  senderDetails: SenderDetailsValues;
};

const AccountOverview: React.FC<AccountOverviewProps> = ({ businessDetails, calendars, senderDetails }) => {
  const { t } = useTranslation('onboarding');

  const senderContactDetails = senderDetails.senderContact;
  const currentCountryCode = senderContactDetails.countryCode;
  const dialCode = phoneByCountry[currentCountryCode].phoneDetails.dialCode;
  const canonicalFormattedPhoneNumber = `${dialCode} ${senderContactDetails.phoneNumber}`;

  const industryCategory = t(
    `businessDetails.industries.${businessDetails.companyIndustry.category}.label` as ParseKeys<'onboarding'>
  );
  const industrySubcategory = t(
    `businessDetails.industries.${businessDetails.companyIndustry.category}.sectors.${businessDetails.companyIndustry.subcategory}` as ParseKeys<'onboarding'>
  );

  const isCustomIndustry = !!businessDetails.companyIndustry.customIndustry;

  const displayIndustry = isCustomIndustry
    ? businessDetails.companyIndustry.customIndustry
    : `${industryCategory} > ${industrySubcategory}`;

  const summaryFields = [
    {
      label: t('businessDetails.formNameField.label'),
      value: businessDetails.name
    },
    {
      label: t('businessDetails.formAddressField.label'),
      value: businessDetails.address
    },
    {
      label: t('senderDetails.title'),
      value: canonicalFormattedPhoneNumber
    },
    {
      label: t('businessDetails.formIndustryCategoryField.label'),
      value: displayIndustry
    }
  ];

  const pMarginClasses = 'mt-3.5 mb-3.5'

  return (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
      <h3 className="mt-4.5 mb-4 text-lg font-medium text-gray-800">{t('confirm.accountSummary')}</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 xl:gap-4 text-sm">
        {summaryFields.map(({ label, value }) => (
          <div key={label}>
            <p className={clsx(pMarginClasses, 'text-gray-500')}>{label}</p>
            <p className={clsx(pMarginClasses, 'font-medium')}>{value}</p>
          </div>
        ))}

        <div>
          <p className="text-gray-500">{t('calendars.title')}</p>
          {calendars.calendars.map(({ id, name }) => (
            <p key={id} className={clsx(pMarginClasses, 'font-medium')}>
              {name}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AccountOverview;
