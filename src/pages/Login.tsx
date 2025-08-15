import type { JSX } from 'react';

import { LeftColumn } from '@components/ui/Login/LeftColumn';
import { LoginForm } from '@components/ui/Login/LoginForm';
import { RightColumn } from '@components/ui/Login/RightColumn';

export const Login = (): JSX.Element => {
  return (
    <div className="min-h-[calc(100vh-71px)] bg-white flex flex-col lg:flex-row">
      <LeftColumn>
        <LoginForm />
      </LeftColumn>
      <RightColumn />
    </div>
  );
};
