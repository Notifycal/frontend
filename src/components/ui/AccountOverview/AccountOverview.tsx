import type { BusinessDetailsValues } from '@components/onboarding/BusinessDetails';
import type { CalendarsValues } from '@components/onboarding/Calendars';
import type { SenderDetailsValues } from '@components/onboarding/SenderDetails';
import { phoneByCountry } from '@notifycal/shared/i18n';
import { useTranslation } from 'react-i18next';

type Foo = {
  businessDetails: BusinessDetailsValues;
  calendars: CalendarsValues;
  senderDetails: SenderDetailsValues;
};

const AccountOverview: React.FC<Foo> = ({ businessDetails, calendars, senderDetails }) => {
  const { t } = useTranslation('onboarding');

  const senderContactDetails = senderDetails?.contactDetails;
  const currentCountryCode = senderContactDetails?.countryCode;
  const dialCode = phoneByCountry[currentCountryCode].phoneDetails.dialCode;
  const canonicalFormattedPhoneNumber = `${dialCode} ${senderContactDetails?.phoneNumber}`;

  return (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
      <h3 className="text-lg font-medium text-gray-800 mb-4">{t('confirm.accountSummary')}</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 xl:gap-4 text-sm">
        <div>
          <p className="text-gray-500">{t('businessDetails.formNameField.label')}</p>
          <p className="font-medium">{businessDetails?.name}</p>
        </div>

        <div>
          <p className="text-gray-500">{t('businessDetails.formAddressField.label')}</p>
          <p className="font-medium">{businessDetails?.address}</p>
        </div>

        <div>
          <p className="text-gray-500">{t('senderDetails.title')}</p>
          <p className="font-medium">{canonicalFormattedPhoneNumber}</p>
        </div>

        {/* {businessDetails && businessDetails.companyIndustry && (
          <div>
            <p className="text-gray-500">{t('businessDetails.formIndustryField.label')}</p>
            <p className="font-medium">{t(`businessDetails.industries.${businessDetails.companyIndustry}`)}</p>
          </div>
        )} */}

        <div>
          <p className="text-gray-500">{t('calendars.title')}</p>
          {calendars?.calendars.map(({ id, name }) => (
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
