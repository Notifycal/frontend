import type { FunctionComponent } from '@common/types';
import { Controller, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import 'react-phone-number-input/style.css';
import { z } from 'zod';
import NewPhoneInput from '../PhoneInput/NewPhoneInput';
import type { Step } from './Wizard';

// const StepSenderDetailsSchema = z.object({
//   contactDetails: z.object({
//     type: z.literal('phone'),
//     identifier: z.object({
//       country: z.string().min(5, { message: 'Phone country is required' }),
//       localIdentifier: z.string().min(5, { message: 'Phone number is required' })
//     })
//   })
// });
const StepSenderDetailsSchema = z.object({
  testFoo: z.object(
    { number: z.string().min(1, { message: 'invalid phone' }), checked: z.literal(true, { message: 'bool fail' }) },
    { message: 'hey you!!' }
  )
});
// .refine(
//   (data) => {
//     return isValidMobilePhoneNumber(data.contactDetails.identifier as PhoneNumber, 'es');
//   },
//   { message: 'Invalid phone number', path: ['contactDetails', 'identifier'] }
// );

// const StepSenderDetailsSchema = z.object({ contactDetails: phoneContactSchema });
export type StepSenderDetailsValues = z.infer<typeof StepSenderDetailsSchema>;
const StepSenderDetailsComponent = (): FunctionComponent => {
  const { t, i18n } = useTranslation();
  const { control } = useFormContext<StepSenderDetailsValues>();

  return (
    <Controller
      control={control}
      name="testFoo"
      render={({ field: { value, onChange, ...rest }, formState }) => {
        console.log('FormState:', formState);
        return (
          <NewPhoneInput
            error={formState.errors.testFoo?.checked?.message || formState.errors.testFoo?.number?.message}
            label={t('onboarding.stepSenderDetails.msg1')}
            {...rest}
            value={value}
            onChange={onChange}
          />
        );
      }}
    />
  );
};

export const StepSenderDetails: Step<typeof StepSenderDetailsSchema> = {
  component: StepSenderDetailsComponent,
  schema: StepSenderDetailsSchema,
  defaultValues: { testFoo: { checked: false, number: '' } }
};
