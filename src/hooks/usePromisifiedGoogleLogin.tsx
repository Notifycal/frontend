import { useRef } from 'react';

import { useGoogleLogin, type CodeResponse, type UseGoogleLoginOptionsAuthCodeFlow } from '@react-oauth/google';

type PromiseResolveType = (codeResponse: CodeResponse) => unknown;
type PromiseRejectType = (errorResponse: Pick<CodeResponse, 'error' | 'error_description' | 'error_uri'>) => unknown;

type PromiseHandlersRef = {
  resolve: PromiseResolveType | null;
  reject: PromiseRejectType | null;
};

export default function usePromisifiedGoogleLogin(options: UseGoogleLoginOptionsAuthCodeFlow) {
  const promiseHandlers = useRef<PromiseHandlersRef>({ resolve: null, reject: null });

  const googleLogin = useGoogleLogin({
    ...options,
    onSuccess: (codeResponse: CodeResponse) => {
      if (promiseHandlers.current.resolve) {
        promiseHandlers.current.resolve(codeResponse);
        promiseHandlers.current.resolve = null;
        promiseHandlers.current.reject = null;
      }
    },
    onError: (errorResponse: Pick<CodeResponse, 'error' | 'error_description' | 'error_uri'>) => {
      if (promiseHandlers.current.reject) {
        promiseHandlers.current.reject(errorResponse);
        promiseHandlers.current.reject = null;
        promiseHandlers.current.resolve = null;
      }
    }
  });

  return (): Promise<CodeResponse> => {
    return new Promise<CodeResponse>((resolve, reject) => {
      promiseHandlers.current.resolve = resolve as PromiseResolveType;
      promiseHandlers.current.reject = reject as PromiseRejectType;
      googleLogin();
    });
  };
}
