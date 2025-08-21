import type { JSX } from 'react';

import { BannerCarousel } from './BannerCarousel';
import { Trans, useTranslation } from 'react-i18next';

export const RightColumn = (): JSX.Element => {
  const { t } = useTranslation();

  const loginSlides = t('login.carouselSlides', { returnObjects: true });

  return (
    <div className="z-10 flex flex-col flex-1 items-center justify-center w-full text-center bg-gradient-to-br from-primary-600 via-purple-600 to-secondary-600 basis-0">
      <div className="px-4">
        <h2 className="text-2xl lg:text-3xl font-bold text-primary-50 mb-8 lg:mb-12">
          <Trans i18nKey="login.rightCta" />
        </h2>
        <BannerCarousel slides={loginSlides} />
      </div>
    </div>
  );
};
