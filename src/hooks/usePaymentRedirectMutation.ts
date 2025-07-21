import type { RedirectUrlSession } from '@api/payments';
import { useMutation, type UseMutationOptions, type UseMutationResult } from '@tanstack/react-query';

type MutationFn<TVariables> = (variables: TVariables) => Promise<RedirectUrlSession>;

type RedirectUrlSessionUseMutationOptions<T> = UseMutationOptions<RedirectUrlSession, Error, T>;

// By making `onError` required in the options, we force the caller to be explicit about error handling.
type PaymentMutationOptions<TVariables> = Omit<RedirectUrlSessionUseMutationOptions<TVariables>, 'mutationFn'> & {
  onError: NonNullable<RedirectUrlSessionUseMutationOptions<TVariables>['onError']>;
};

const usePaymentRedirectMutation = <TVariables>(
  mutationFn: MutationFn<TVariables>,
  options: PaymentMutationOptions<TVariables>
): UseMutationResult<RedirectUrlSession, Error, TVariables> => {
  return useMutation<RedirectUrlSession, Error, TVariables>({
    mutationFn,
    onSuccess: (result: RedirectUrlSession) => {
      window.location.href = result.url;
    },
    // Spread all other options, including the now-mandatory onError
    ...options
  });
};

export default usePaymentRedirectMutation;
