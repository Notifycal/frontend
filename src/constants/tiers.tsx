import type { TierId } from '@notifycal/shared/types';

type ExpectedTierOrder = readonly ['good', 'better', 'best'];

type IsExactOrder<T extends ReadonlyArray<TierId>> = T extends ExpectedTierOrder
  ? ExpectedTierOrder extends T
    ? T
    : never
  : never;

export const tierOrder: IsExactOrder<ExpectedTierOrder> = ['good', 'better', 'best'];
