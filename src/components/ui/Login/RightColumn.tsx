import type { JSX } from 'react';

import { BannerCarousel } from './BannerCarousel';

export const RightColumn = (): JSX.Element => {
  return (
    <div className="z-10 flex flex-col flex-1 items-center justify-center w-full text-center bg-gradient-to-br from-primary-600 via-purple-600 to-secondary-600 basis-0">
      <div className="px-4">
        <h2 className="text-2xl lg:text-3xl font-bold text-primary-50 mb-8 lg:mb-12">
          Turn your ideas into <br />
          reality
        </h2>
        <BannerCarousel />
      </div>
    </div>
  );
};
