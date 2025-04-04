import { useTranslation } from 'react-i18next';

import type { FunctionComponent } from '@common/types';
import { Button } from '@mantine/core';

interface FullScreenErrorProps {
  errorMessage?: string;
  onRetry?: () => void;
}

const FullPageError = ({ errorMessage, onRetry }: FullScreenErrorProps): FunctionComponent => {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-screen flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-100">
      <div className="sm:mx-auto sm:w-full sm:max-w-[480px]">
        <div className="text-center bg-white px-6 py-12 shadow-sm sm:rounded-lg sm:px-12">
          <div className=" sm:mx-auto sm:w-full sm:max-w-md mb-6">
            <img
              alt="Your Company"
              className="mx-auto h-10 w-auto mb-6"
              src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600"
            />
            <h1 className="text-3xl font-bold text-gray-800 mb-4">{t('globalError.somethingWrong')}</h1>
            {errorMessage && <p className="text-gray-600 mb-6">{errorMessage}</p>}
          </div>
          <div className="space-y-4">
            <Button
              className="w-full"
              size="lg"
              style={{ backgroundColor: '#228be6' }} // Customize Mantine button style
              variant="filled"
              onClick={onRetry}
            >
              {t('globalError.refreshPage')}
            </Button>
            <a className="block text-sm text-gray-500 hover:text-gray-800 transition" href="mailto:notifycal@gmail.com">
              {t('globalError.contactSupport')}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FullPageError;
