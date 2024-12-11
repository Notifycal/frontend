import { useTranslation } from 'react-i18next';
import type { FunctionComponent } from '../common/types';

export const Dashboard = (): FunctionComponent => {
  const { t } = useTranslation();

  return (
    <>
      <h1>foobar</h1>
    </>
  );
};
