import 'axios';

declare module 'axios' {
  export interface AxiosRequestConfig {
    skipAuthorization?: boolean;
    skipTokenRefresh?: boolean;
  }
}
