import { smsCharacterRegex } from '@constants/regexes';
import { z } from 'zod';

/* eslint-disable @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types */
export const stringArrayValidatorSchema = (validValues: Array<string>, message?: string) => {
  const base = message ? z.string({ message }) : z.string();
  return base.refine(
    (currentValue) => (currentValue ? validValues.includes(currentValue) : false),
    message ? { message } : undefined
  );
};

export const smsValidStringSchema = ({
  messageRegex,
  messageString
}: {
  messageRegex?: string;
  messageString?: string;
}) => {
  const base = messageString ? z.string({ message: messageString }) : z.string();
  return messageRegex ? base.regex(smsCharacterRegex, { message: messageRegex }) : base.regex(smsCharacterRegex);
};
