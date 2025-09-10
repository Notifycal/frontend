import type { JSX } from 'react';

import { BannerCarousel } from './BannerCarousel';
import { Trans, useTranslation } from 'react-i18next';

export const RightColumn = (): JSX.Element => {
  const { t } = useTranslation();

  const loginSlides = t('login.carouselSlides', { returnObjects: true });

  return (
    <div className="z-10 flex flex-col flex-1 items-center justify-evenly sm:justify-center sm:gap-6 w-full text-center bg-gradient-to-br from-primary-600 to-secondary-600 basis-0">
      <h3 className="font-bold leading-none text-primary-50 px-4">
        <Trans i18nKey="login.rightCta" />
      </h3>
      <div className="px-4">
        <BannerCarousel slides={loginSlides} />
      </div>
    </div>
  );
};
