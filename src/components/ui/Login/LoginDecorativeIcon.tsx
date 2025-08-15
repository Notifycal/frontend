import type { JSX } from 'react';

export const LoginDecorativeIcon = (): JSX.Element => {
  return (
    <div className="mb-8">
      <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-600 rounded-2xl flex items-center justify-center mx-auto">
        <svg className="w-8 h-8 text-primary-50" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9l-5.27 3.26L18 22l-6-4-6 4 1.27-9.74L2 9l6.91-.74L12 2z" />
        </svg>
      </div>
    </div>
  );
};