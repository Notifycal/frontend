import { html as privacyPolicyContent } from '@assets/locales/es/privacy_policy.md';
import { Legal } from '@components/ui/Legal/Legal';
import type { JSX } from 'react';

export const PrivacyPolicy = (): JSX.Element => {
  return <Legal htmlText={privacyPolicyContent} />;
};
