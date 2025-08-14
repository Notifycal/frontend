import { html as termsAndConditionsContent } from '@assets/locales/es/terms_and_conditions.md';
import { Legal } from '@components/ui/Legal/Legal';
import type { JSX } from 'react';

export const TermsAndConditions = (): JSX.Element => {
  return <Legal htmlText={termsAndConditionsContent} />;
};
