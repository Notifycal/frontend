import { useTranslation } from 'react-i18next';
import type { FunctionComponent } from '../common/types';

import AppLayout from '../components/layout/AppLayout';

const user = {
  name: 'Tom Cook',
  email: 'tom@example.com',
  imageUrl:
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
};

export const Dashboard = (): FunctionComponent => {
  const { t } = useTranslation();

  return (
    <AppLayout user={user} fancyHeaderTitle="Dashboard" useFancyHeader>
      <div>foobar</div>
    </AppLayout>
  );
};
