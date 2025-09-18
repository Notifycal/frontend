import type { FC } from 'react';

import { Trans, useTranslation } from 'react-i18next';

import { Divider } from '@mantine/core';
import { IconCircleCheckFilled } from '@tabler/icons-react';

import { TierFeatures, type TierInfoWithIcon } from '@notifycal/shared/components';

interface UserTierInfoProps {
  tierInfo: TierInfoWithIcon;
}

const UserTierInfo: FC<UserTierInfoProps> = ({ tierInfo }) => {
  const { t } = useTranslation(['translation', 'onboarding']);

  const { icon: TierIcon } = tierInfo;

  return (
    <>
      <h1 className="flex items-center gap-2 text-4xl font-bold">
        <TierIcon className="inline w-[1em] h-[1em] text-amber-400" />
        {tierInfo.displayName}
      </h1>
      <div>
        <Trans
          components={[<span className="font-bold" />]}
          i18nKey="billing.currentPlan"
          ns="translation"
          values={{ tierName: tierInfo.displayName }}
        />
      </div>
      <Divider my="md" />

      <div>{t('billing.yourPlanIncludes', { ns: 'translation' })}</div>
      <TierFeatures icon={IconCircleCheckFilled} tier={tierInfo} />
    </>
  );
};

export default UserTierInfo;
