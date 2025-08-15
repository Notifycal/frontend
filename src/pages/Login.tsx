import type { JSX } from 'react';

import { LoginFormContainer } from '@components/ui/Login/LoginFormContainer';
import { LoginLeftColumn } from '@components/ui/Login/LoginLeftColumn';
import { LoginRightColumn } from '@components/ui/Login/LoginRightColumn';

export const Login = (): JSX.Element => {
  return (
    <div className="min-h-[calc(100vh-71px)] bg-white flex flex-col lg:flex-row">
      <LoginLeftColumn>
        <LoginFormContainer />
      </LoginLeftColumn>
      <LoginRightColumn />
    </div>
  );
};
