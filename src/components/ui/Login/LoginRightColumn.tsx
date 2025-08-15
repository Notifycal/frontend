import type { JSX } from 'react';

import { LoginBannerCarousel } from './LoginBannerCarousel';

export const LoginRightColumn = (): JSX.Element => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-purple-600 to-secondary-600 flex lg:w-1/2 lg:order-2 min-h-[400px] lg:min-h-auto">
      <div className="absolute inset-0 bg-black/20" />
      <div className="relative z-10 flex flex-col items-center justify-center w-full text-center px-8 py-12 lg:py-8">
        <h2 className="text-2xl lg:text-3xl font-bold text-primary-50 mb-8 lg:mb-12">
          Turn your ideas into <br />
          reality
        </h2>

        <LoginBannerCarousel />
      </div>
    </div>
  );
};