import type { BusinessDetailsValues } from '@components/onboarding/BusinessDetails';
import type { CalendarsValues } from '@components/onboarding/Calendars';
import type { SenderDetailsValues } from '@components/onboarding/SenderDetails';
import { phoneByCountry } from '@notifycal/shared/i18n';
import type { ParseKeys } from 'i18next';
import { useTranslation } from 'react-i18next';

type AccountOverviewProps = {
  businessDetails: BusinessDetailsValues;
  calendars: CalendarsValues;
  senderDetails: SenderDetailsValues;
};

const AccountOverview: React.FC<AccountOverviewProps> = ({ businessDetails, calendars, senderDetails }) => {
  const { t } = useTranslation('onboarding');

  const senderContactDetails = senderDetails.contactDetails;
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

  return (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
      <h3 className="text-lg font-medium text-gray-800 mb-4">{t('confirm.accountSummary')}</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 xl:gap-4 text-sm">
        {summaryFields.map(({ label, value }) => (
          <div>
            <p className="text-gray-500">{label}</p>
            <p className="font-medium">{value}</p>
          </div>
        ))}

        <div>
          <p className="text-gray-500">{t('calendars.title')}</p>
          {calendars.calendars.map(({ id, name }) => (
            <p key={id} className="font-medium">
              {name}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AccountOverview;
