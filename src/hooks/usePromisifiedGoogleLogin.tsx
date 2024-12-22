import { CodeResponse, UseGoogleLoginOptionsAuthCodeFlow, useGoogleLogin } from '@react-oauth/google';
import { useRef } from 'react';

type PromiseResolveType = (codeResponse: CodeResponse) => {};
type PromiseRejectType = (errorResponse: Pick<CodeResponse, 'error' | 'error_description' | 'error_uri'>) => {};

type PromiseHandlersRef = {
  resolve: PromiseResolveType | null,
  reject: PromiseRejectType | null
}

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

  return () => {
    return new Promise<CodeResponse>((resolve, reject) => {
      promiseHandlers.current.resolve = resolve as PromiseResolveType;
      promiseHandlers.current.reject = reject as PromiseRejectType;
      googleLogin();
    });
  };
}
