import { capitalize } from 'radashi';
import type { FC } from 'react';

import { Trans, useTranslation } from 'react-i18next';

import type { TierInfoWithIcon } from '@components/onboarding/TierCard';
import { Alert, Divider, Title } from '@mantine/core';
import { IconCircleCheckFilled } from '@tabler/icons-react';
import TierFeatures from '../TierFeatures/TierFeatures';

interface UserTierInfoProps {
  tierInfo: TierInfoWithIcon;
}

const UserTierInfo: FC<UserTierInfoProps> = ({ tierInfo }) => {
  const { t } = useTranslation();

  const { icon: TierIcon } = tierInfo;

  return (
    <>
      <Title className="flex items-center gap-2" order={1}>
        <TierIcon className="inline w-[1em] h-[1em] text-amber-400" />
        {tierInfo.displayName}
      </Title>
      <div>
        <Trans
          components={[<span className="font-bold" />]}
          i18nKey="billing.currentPlan"
          ns="translations"
          values={{ tierName: tierInfo.displayName }}
        />
      </div>
      <Divider my="md" />

      <div>{t('billing.yourPlanIncludes')}</div>
      <TierFeatures icon={IconCircleCheckFilled} tier={tierInfo} />
      <Divider my="md" />
      <Alert
        title={capitalize(t('generic.remember'))}
        classNames={{
          title: 'text-sm',
          message: 'text-xs'
        }}
      >
        {t('tierSelection.disclaimer', { ns: 'onboarding' })}
      </Alert>
    </>
  );
};

export default UserTierInfo;
