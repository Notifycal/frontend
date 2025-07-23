import type { TierId } from '@notifycal/shared/types';

type ExpectedTierOrder = readonly ['good', 'better', 'best'];
export const tierOrder: ExpectedTierOrder = ['good', 'better', 'best'] as const satisfies ReadonlyArray<TierId>;
